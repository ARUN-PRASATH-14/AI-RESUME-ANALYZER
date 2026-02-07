# 🚀 AI Resume Analyzer

A modern, AI-powered tool that analyzes resumes against job descriptions, providing actionable feedback, ATS scores, and smart rewrites.

AI Resume Analyzer : https://ai-resume-analyzer-fjhsjk3z9-arunmsd007s-projects.vercel.app/

<img width="1817" height="805" alt="image" src="https://github.com/user-attachments/assets/26cf1837-0872-4307-b536-78131ca27fe5" />


## ✨ Features

- **AI-Powered Analysis**: Uses Google Gemini 1.5 Flash to deconstruct resumes.
- **ATS Scoring**: Provides an estimated Applicant Tracking System (ATS) compatibility score.
- **Section-by-Section Feedback**: Detailed critique for Experience, Skills, Education, etc.
- **Smart Rewrites**: AI-suggested improvements for weak bullet points.
- **Premium UI**: Glassmorphism design with live aurora backgrounds and smooth animations.
- **Mobile Responsive**: Fully optimized for all device sizes.
- **Secure**: API keys are handled client-side (or via proxy) and never stored.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (CSS Modules / Variables)
- **AI Model**: Google Gemini 1.5 Flash-8b
- **Icons**: Lucide React
- **PDF Parsing**: `pdfjs-dist`
- **Deployment**: Vercel / Firebase

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/ai-resume-analyzer.git
    cd ai-resume-analyzer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_dummy_api_key_here
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 📦 Deployment

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the `VITE_GEMINI_API_KEY` in Vercel **Settings > Environment Variables**.
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

