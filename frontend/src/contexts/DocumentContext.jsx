import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const DocumentContext = createContext();

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const { session } = useAuth();

  const fetchAllDocuments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/document/my/all`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const fetchDocument = async (documentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/document/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setCurrentDocument(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch document:", error);
      return null;
    }
  };

  // Fetch all documents when session changes
  useEffect(() => {
    if (session?.access_token) {
      fetchAllDocuments();
    }
  }, [session?.access_token]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        currentDocument,
        fetchDocument,
        fetchAllDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};
