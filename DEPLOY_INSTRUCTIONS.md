# 🚀 How to Deploy to Firebase Hosting

Since I cannot log in to your Google account for you, please follow these simple steps to put your site live!

## 1. Essentials
Open a **new terminal** in VS Code (Ctrl+Shift+`) and run:
```bash
npm install -g firebase-tools
```
*(If the command below fails, you can skip this step and just use `npx` as shown below)*

## 2. Login
Authenticate with your Google account:
```bash
npx firebase login
```
*It will open your browser. Login and accept permissions.*

## 3. Initialize
Configure the project for hosting:
```bash
npx firebase init hosting
```
**Select these options when asked:**
1.  **"What do you want to use as your public directory?"** ➔ Type strict: `dist`
2.  **"Configure as a single-page app (rewrite all urls to /index.html)?"** ➔ Type: `y`
3.  **"Set up automatic builds and deploys with GitHub?"** ➔ Type: `n`
4.  **"File dist/index.html already exists. Overwrite?"** ➔ Type: `n` (Important! Do NOT overwrite)

## 4. Deploy 🚀
Send it to the cloud:
```bash
npx firebase deploy
```

The terminal will give you a **Hosting URL** (e.g., `https://your-project.web.app`). Click it to see your live site!

> **Note:** If you change any code later, just run `npm run build` followed by `firebase deploy` to update the live site.
