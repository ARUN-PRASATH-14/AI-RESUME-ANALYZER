# 🚀 How to Deploy to Vercel

Vercel is actually much easier than Firebase! You don't need to configure anything.

## 1. Login & Deploy (All in one)
Open your terminal and run:
```bash
npx vercel
```

## 2. Follow the Prompts
You will be asked a few questions. Accept all the defaults by pressing **Enter**:

1.  **Set up and deploy "ai-resume-analyzer"?** ➔ **`y`** (Yes)
2.  **Which scope do you want to deploy to?** ➔ **Enter** (Select your username)
3.  **Link to existing project?** ➔ **`n`** (No)
4.  **What’s your project’s name?** ➔ **Enter** (Accept default `ai-resume-analyzer`)
5.  **In which directory is your code located?** ➔ **Enter** (Accept default `./`)
6.  *It will auto-detect Vite settings.* **Want to modify these settings?** ➔ **`n`** (No)

## 3. Done! 🎉
It will build and deploy. You'll get a URL like:
`https://ai-resume-analyzer-yourname.vercel.app`

---

### **Important Note on Environment Variables:**
Since we receive the API Key from `.env` locally, you **must** add it to Vercel for the live site to work.

1.  Go to the URL it gives you (Project Dashboard).
2.  Click **Settings** > **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `VITE_GEMINI_API_KEY`

4.  Click **Save** and then **Redeploy** (or run `npx vercel --prod` in terminal).
