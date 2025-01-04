// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export async function getChatCompletion(message) {
//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI chatbot that responds to user queries in Bangla. The user may input their queries in Bangla or Banglish (Bangla written using English characters). Always respond in Bangla, maintaining a friendly and helpful tone. If the input is unclear or incomplete, politely ask for clarification in Bangla.
//           Examples:
//             1. User: "আমার জন্য কি রেসিপি সাজেস্ট করতে পারো?"
//             AI: "অবশ্যই! আপনি কী ধরনের রেসিপি চান? মিষ্টি নাকি ঝাল?"
//             2. User: "amar jonno ki recipe suggest korte paro?"
//             AI: "অবশ্যই! আপনি কী ধরনের রেসিপি চান? মিষ্টি নাকি ঝাল?"
//             3. User: "ভালো স্কুল কোথায় আছে?"
//             AI: "আপনার এলাকায় ভালো স্কুল খুঁজে বের করতে Google Map বা স্থানীয় গাইড ব্যবহার করতে পারেন।`,
//         },
//         { role: "user", content: message },
//       ],
//       model: "gpt-3.5-turbo",
//       max_tokens: 150,
//       temperature: 0.7,
//       top_p: 0.8,
//       frequency_penalty: 0.7,
//       presence_penalty: 0.3,
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.error("OpenAI API Error:", error);
//     throw error;
//   }
// }

const isBangla = (text) => {
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text);
};

export async function getChatCompletion(query, access_token) {
  try {
    const response = await fetch("http://localhost:8080/user/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        query: query,
        is_bangla: isBangla(query),
        // user_id: "user123", // Optional: to maintain user-specific chat history
      }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}
