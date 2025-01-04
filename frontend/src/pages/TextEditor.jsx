import "regenerator-runtime/runtime";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Save,
  Languages,
  FileDown,
  Moon,
  Sun,
  MessageCircle,
  Mic,
  MicOff,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useTheme } from "@/contexts/ThemeContext";
import { generateDocumentName } from "@/utils/gemini";
import { useDocument } from "@/contexts/DocumentContext";
import "react-quill/dist/quill.snow.css";
import "@/styles/editor.css";

const TextEditor = () => {
  const [banglishContent, setBanglishContent] = useState("");
  const [banglaContent, setBanglaContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const quillRef = useRef(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const { currentDocument, fetchDocument } = useDocument();

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      const position = range ? range.index : editor.getLength();

      // Insert the transcript at cursor position
      editor.insertText(position, " " + transcript, "user");

      // Move cursor to end of inserted text
      const newPosition = position + transcript.length + 1;
      editor.setSelection(newPosition, position);

      // Update the content state
      setBanglishContent(editor.getText());

      resetTranscript();
    }
  }, [transcript]);

  useEffect(() => {
    if (id === "new") {
      // Reset content for new document
      setBanglishContent("");
      setBanglaContent("");
      setDocumentTitle("Untitled Document");
    } else if (id && id !== "new") {
      fetchDocument(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentDocument) {
      setBanglishContent(currentDocument.original_text || "");
      setBanglaContent(currentDocument.converted_text || "");
      setDocumentTitle(currentDocument.title || "Untitled Document");
    }
  }, [currentDocument]);

  useEffect(() => {
    const editorElement = document.querySelector(".ql-editor");
    if (editorElement) {
      if (isDark) {
        editorElement.style.backgroundColor = "#1e293b"; // slate-800
        editorElement.style.color = "#e2e8f0"; // slate-200
      } else {
        editorElement.style.backgroundColor = "#ffffff";
        editorElement.style.color = "#1e293b";
      }
    }
  }, [isDark]);

  const loadDocument = (docId) => {
    try {
      const existingDocs = JSON.parse(
        localStorage.getItem("documents") || "[]"
      );
      const doc = existingDocs.find((d) => d.id === docId);
      if (doc) {
        setBanglishContent(doc.content || "");
        setBanglaContent(doc.convertedContent || "");
        setDocumentTitle(doc.name || "Untitled Document");
      }
    } catch (error) {
      console.error("Error loading document:", error);
    }
  };

  const convertToBangla = async () => {
    try {
      setIsConverting(true);
      const rawText = quillRef.current.getEditor().getText();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/banglish-to-bangla`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ banglish_text: rawText }),
        }
      );

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setBanglaContent(data.bangla_text);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleExportPDF = () => {
    const editorContent = quillRef.current?.getEditor()?.root;
    if (editorContent) {
      const opt = {
        margin: [10, 10],
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(editorContent).save();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const rawText = quillRef.current?.getEditor()?.getText() || "";
      const formatting = JSON.stringify(
        quillRef.current?.getEditor()?.getContents() || {}
      );

      let finalTitle = documentTitle;
      if (documentTitle === "Untitled Document" && rawText.trim()) {
        finalTitle = await generateDocumentName(rawText);
        setDocumentTitle(finalTitle);
      }

      const documentData = {
        title: finalTitle,
        original_text: rawText,
        formatting: formatting,
        is_public: true,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      const existingDocs = JSON.parse(
        localStorage.getItem("documents") || "[]"
      );
      const newDoc = {
        id: id === "new" ? Date.now().toString() : id,
        name: finalTitle,
        content: banglishContent,
        convertedContent: banglaContent,
        userId: user?.email,
        lastModified: new Date().toISOString(),
      };

      let updatedDocs;
      if (id === "new") {
        updatedDocs = [...existingDocs, newDoc];
      } else {
        const index = existingDocs.findIndex((d) => d.id === id);
        if (index !== -1) {
          updatedDocs = [
            ...existingDocs.slice(0, index),
            newDoc,
            ...existingDocs.slice(index + 1),
          ];
        } else {
          updatedDocs = [...existingDocs, newDoc];
        }
      }

      localStorage.setItem("documents", JSON.stringify(updatedDocs));

      window.dispatchEvent(new CustomEvent("documentsUpdated"));

      if (id === "new") {
        navigate(`/editor/${newDoc.id}`);
      }
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMicrophoneToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      toast.error("Microphone Off", { autoClose: 1500 });
    } else {
      SpeechRecognition.startListening({ continuous: true });
      toast.success("Microphone On", { autoClose: 1500 });
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
        }`}
      >
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className={`text-xl font-semibold outline-none ${
            isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
          }`}
        />
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full ${
              isDark
                ? "text-yellow-300 hover:text-yellow-200"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            className={`${isDark ? "text-gray-300" : "text-gray-400"}`}
            variant={isDark ? "outline" : "secondary"}
            size="sm"
            onClick={convertToBangla}
            disabled={isConverting}
          >
            <Languages className="w-4 h-4 mr-2" />
            {isConverting ? "Converting..." : "Convert to Bangla"}
          </Button>
          <Button
            className={`${isDark ? "text-gray-300" : "text-gray-400"}`}
            variant={isDark ? "outline" : "secondary"}
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            className={`${isDark ? "text-gray-300" : "text-gray-400"}`}
            variant={isDark ? "outline" : "secondary"}
            size="sm"
            onClick={handleExportPDF}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicrophoneToggle}
            className={`${listening ? "bg-red-500 text-white" : ""}`}
            title={listening ? "Stop Recording" : "Start Recording"}
          >
            {listening ? <MicOff /> : <Mic />}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex overflow-hidden p-4 space-x-4">
        <Card
          className={`flex-1 ${
            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="h-[calc(100vh-16rem)]">
              <ReactQuill
                ref={quillRef}
                value={banglishContent}
                onChange={setBanglishContent}
                modules={modules}
                formats={formats}
                placeholder="Start typing or use voice input..."
                theme="snow"
                className={`h-full ${isDark ? "quill-dark" : ""}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`flex-1 ${
            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div
              className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}
              dangerouslySetInnerHTML={{ __html: banglaContent }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={() => navigate("/chat")}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
          isDark
            ? "bg-violet-600 hover:bg-violet-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="sr-only">Open Chat</span>
      </Button>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
};

export default TextEditor;
