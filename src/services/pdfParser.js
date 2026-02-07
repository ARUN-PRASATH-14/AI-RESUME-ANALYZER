import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set worker to the one from the CDN to avoid build issues with Vite for now, 
// or use the one from node_modules if configured correctly. 
// For simplicity in Vite without complex config, using the CDN or direct import often works best.
// However, let's try the standard import first and see if Vite handles it.
// Actually, pdfjs-dist v3+ requires setting the workerSrc.
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extracts text from a PDF file
 * @param {File} file - The PDF file object
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to extract text from PDF. Please ensure it is a valid PDF file.");
    }
};
