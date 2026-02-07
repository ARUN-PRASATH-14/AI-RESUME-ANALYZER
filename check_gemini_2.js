import { GoogleGenerativeAI } from "@google/generative-ai";

// User provided keys
const keys = [
    "AIzaSyDGOcRJzRPGKwv9Nx-74oTMDdPgVAOolIY"
];

async function checkGemini2() {
    console.log("Checking Gemini 2.0 Flash Experimental...");

    for (const key of keys) {
        console.log(`\nTesting Key: ${key.substring(0, 10)}...`);
        const genAI = new GoogleGenerativeAI(key);
        // "gemini-2.0-flash-exp" is the current high-limit free model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        try {
            const result = await model.generateContent("Hello, are you active?");
            const response = await result.response;
            console.log("✅ SUCCESS! Response:", response.text().trim());
            console.log(">>> RECOMMENDED STRATEGY: Switch back to Gemini with this model.");
            return; // Found a working one
        } catch (error) {
            console.log("❌ FAILED:", error.message.split(' ')[0], error.message.substring(0, 100));
        }
    }
}

checkGemini2();
