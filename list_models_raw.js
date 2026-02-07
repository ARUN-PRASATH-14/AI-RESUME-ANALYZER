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

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Fetching models from:", url.replace(apiKey, 'HIDDEN_KEY'));

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.models) {
            console.log("\n✅ AVAILABLE MODELS:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("❌ ERROR:", data);
        }
    })
    .catch(err => console.error("Request failed:", err));
