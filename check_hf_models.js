import fs from 'fs';
import path from 'path';

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_HF_API_TOKEN=(.*)/);
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

const candidates = [
    "mistralai/Mistral-7B-Instruct-v0.3",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "mistralai/Mistral-7B-Instruct-v0.1",
    "HuggingFaceH4/zephyr-7b-beta",
    "google/gemma-7b-it",
    "google/gemma-2b-it",
    "microsoft/Phi-3-mini-4k-instruct"
];

console.log(`Checking models with API KEY: ${apiKey.substring(0, 10)}...`);

async function checkModels() {
    for (const model of candidates) {
        process.stdout.write(`Testing ${model}... `);
        const url = `https://api-inference.huggingface.co/models/${model}`;

        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${apiKey}` },
                method: "POST",
                body: JSON.stringify({ inputs: "Hello" }),
            });

            if (response.ok) {
                console.log("✅ SUCCESS");
            } else {
                console.log(`❌ FAILED (${response.status} ${response.statusText})`);
            }
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
    }
}

checkModels();
