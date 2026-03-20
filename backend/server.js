import express from 'express';
import cors from 'cors';
import multer from 'multer';
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
app.post('/analyze-profile', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {
    console.log(`\n--- [${new Date().toISOString()}] POST /analyze-profile ---`);
    console.log('Request received successfully from the frontend onboarding flow!');
    
    // Check and log the uploaded parts
    const resumeFile = req.files?.['resume']?.[0];
    const jdFile = req.files?.['jobDescription']?.[0];
    const jdText = req.body.jobDescription;

    let resumeString = '';
    let jdString = '';

    if (resumeFile) {
        resumeString = resumeFile.buffer.toString('utf-8');
        console.log("Resume received:", resumeFile.originalname);
        console.log("resumeText length:", resumeString.length);
        console.log("Preview:\n", resumeString.slice(0, 200));
    } else {
        console.log('⚠️ Warning: No resume file was received');
    }

    if (jdFile) {
        jdString = jdFile.buffer.toString('utf-8');
        console.log("Job description file received length:", jdString.length);
    } else if (jdText) {
        jdString = jdText;
        console.log("Job description text received length:", jdString.length);
    } else {
        console.log('⚠️ Warning: No job description was received');
    }

    try {
        console.log("Calling LLM...");
        const llmResult = await extractSkills(resumeString, jdString);
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
