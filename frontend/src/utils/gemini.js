import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateDocumentName(content) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Given the following document content, suggest a short, descriptive title (maximum 5 words) that captures its main topic or purpose. Try to aboid negative words. Only return the title, nothing else. Content: ${content}`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();
    console.log(result);
    return response.trim();
  } catch (error) {
    console.error("Error generating document name:", error);
    return "Untitled Document";
  }
}
