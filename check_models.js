import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Simple .env parser since we can't depend on dotenv being installed if not in package.json
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

console.log("Checking models for API KEY: " + apiKey.substring(0, 10) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // For listing models, we can't use the simple client easily as it's not exposed top-level in recent SDK versions the same way?
        // Actually typically it is via a ModelManager or similar, but the easiest way to check if a model works is just to try generating "Hello" with it.
        // However, the SDK *does* likely have listModels via the request mechanism if we dig, but let's just TRY a few common ones.

        // Wait, the SDK DOES rely on the API. 
        // Let's just try to generate content with 3-4 standard candidates and print which one wins.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-2.0-flash"
        ];

        console.log("Testing generation with candidates...");

        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                await result.response;
                console.log("✅ SUCCESS");
            } catch (error) {
                if (error.message.includes("404")) {
                    console.log("❌ 404 NOT FOUND");
                } else if (error.message.includes("429")) {
                    console.log("⚠️ 429 RATE LIMITED (Exists but busy)");
                } else {
                    console.log("❌ ERROR: " + error.message.split(' ')[0]); // print short error
                }
            }
        }

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

listModels();
