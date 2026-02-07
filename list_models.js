import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env file");
}

if (!apiKey) {
    console.error("No API KEY found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log(`Checking models for key: ${apiKey.substring(0, 10)}...`);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client? 
        // Actually SDK exposes listModels via the client?
        // No, in the JS SDK usually we just try models. 
        // But there isn't a direct 'listModels' on the minimal client in some versions.
        // Let's try to just use a known stable one: gemini-pro

        // Wait, the error message literally said: "Call ListModels to see the list"
        // In the Node SDK (server side), we can use GoogleAIFileManager or similar, but for the client SDK...
        // Let's just try to hit the REST API directly to list models.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(` - ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.error("❌ Could not list models:", data);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

listModels();
