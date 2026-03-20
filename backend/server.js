import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import { generateRoadmapController } from './controllers/roadmapController.js';
import connectDB from './config/db.js';
import { extractSkills } from './llm/llmClient.js';

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000']
}));
app.use(express.json());

// Set up Multer for handling file fields (using memory storage for parsing)
const upload = multer({ storage: multer.memoryStorage() });

// Database Connection
connectDB();

// Existing API Routes
app.use('/auth', authRoutes);
app.use('/upload-resume', userRoutes);
app.use('/analyze-skills', skillRoutes);
app.post('/generate-roadmap', generateRoadmapController);

// NEW /analyze-profile Endpoint from Onboarding Request
app.post('/analyze-profile', upload.any(), async (req, res) => {
    console.log(`\n--- [${new Date().toISOString()}] POST /analyze-profile ---`);
    console.log('Request received successfully from the frontend onboarding flow!');
    
    // upload.any() returns a flat array of files — find by fieldname
    const resumeFile = req.files?.find(f => f.fieldname === 'resume');
    const jdFile = req.files?.find(f => f.fieldname === 'jobDescription');
    const jdText = req.body.jobDescription;

    let resumeBuffer = null; // Raw PDF buffer for multimodal
    let resumeString = '';   // Text for non-PDF files
    let jdString = '';

    if (resumeFile) {
        console.log("Resume received:", resumeFile.originalname);
        if (resumeFile.originalname.toLowerCase().endsWith('.pdf')) {
            // Send the raw PDF to Gemini multimodal (handles scanned/image PDFs)
            resumeBuffer = resumeFile.buffer;
            console.log("Resume PDF buffer size:", resumeBuffer.length);
        } else {
            resumeString = resumeFile.buffer.toString('utf-8');
            console.log("Resume text length:", resumeString.length);
        }
    } else {
        console.log('⚠️ Warning: No resume file was received');
    }

    if (jdFile) {
        console.log("Job description received:", jdFile.originalname);
        if (jdFile.originalname.toLowerCase().endsWith('.pdf')) {
            try {
                const jdPdfData = await pdfParse(jdFile.buffer);
                jdString = jdPdfData.text;
                console.log("JD PDF text extracted, length:", jdString.length);
            } catch (pdfErr) {
                console.error("JD PDF parse error:", pdfErr.message);
                jdString = jdFile.buffer.toString('utf-8');
            }
        } else {
            jdString = jdFile.buffer.toString('utf-8');
        }
        console.log("Job description file received length:", jdString.length);
    } else if (jdText) {
        jdString = jdText;
        console.log("Job description text received length:", jdString.length);
    } else {
        console.log('⚠️ Warning: No job description was received');
    }

    try {
        console.log("Calling LLM (multimodal)...");
        const llmResult = await extractSkills(resumeBuffer, resumeString, jdString);
        console.log("Parsed response:\n", JSON.stringify(llmResult, null, 2));
        
        // Return ONLY the LLM response without static fallback
        res.status(200).json(llmResult);
    } catch (error) {
        console.error("Endpoint execution error:", error.message);
        res.status(500).json({ error: "Analysis failed: " + error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
