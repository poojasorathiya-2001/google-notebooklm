const Document = require('../models/Document');
const Chat = require('../models/Chat');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Upload PDF
const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
         console.log('req.file:', req.file);

        // Extract text from PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);

        // Save document to database
        const document = new Document({
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            extractedText: pdfData.text,
            pageCount: pdfData.numpages
        });
          console.log('Document to save:', document);

        await document.save();

        // Create initial chat for this document
        const chat = new Chat({
            documentId: document._id,
            messages: []
        });
        await chat.save();

        res.status(201).json({
            success: true,
            document: {
                id: document._id,
                filename: document.originalName,
                pageCount: document.pageCount,
                uploadDate: document.uploadDate
            },
            chatId: chat._id
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
};

// Get document
const getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json({
            id: document._id,
            filename: document.originalName,
            pageCount: document.pageCount,
            uploadDate: document.uploadDate
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get document' });
    }
};

// Serve PDF file
const servePDF = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const filePath = path.resolve(document.filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to serve PDF' });
    }
};

module.exports = {
    upload,
    uploadPDF,
    getDocument,
    servePDF
};