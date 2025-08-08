const Chat = require("../models/Chat");
const Document = require("../models/Document");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(documentText, userQuestion) {
  const model = gemini.getGenerativeModel({ model:  "gemini-1.5-flash"});
  const prompt = `
You are an assistant. You have access to the content of a document, stored page by page.

When answering the user's question:
1.  Provide the answer to the user's question.
2.  After the answer, add a line break (\\n).
3.  In a separate line at the end, mention the page number where you found the information, formatted as: "Page: [page number]". If information is found on the same page, only mention the page number once.

Here is the document content:
${documentText}

Question: ${userQuestion}
Answer:
  `;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const chat = await Chat.findById(chatId).populate("documentId");
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const documentText = chat.documentId.extractedText || "";

    // Gemini API call
    const aiResponse = await askGemini(documentText, message);

    chat.messages.push({ type: "user", content: message, timestamp: new Date() });
    chat.messages.push({ type: "ai", content: aiResponse, timestamp: new Date() });
    await chat.save();

    res.json({ success: true, messages: chat.messages.slice(-2) });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: "Failed to process message" });
  }
};
  
// Get chat history
// const getChatHistory = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.chatId);
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found" });
//     }

//     res.json({
//       messages: chat.messages,
//     });
//   } catch (error) {
//     console.error("Get chat history error:", error);
//     res.status(500).json({ error: "Failed to get chat history" });
//   }
// };

module.exports = {
  sendMessage,
  // getChatHistory,
};
