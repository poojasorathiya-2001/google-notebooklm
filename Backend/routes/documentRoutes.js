const express = require('express');
const router = express.Router();
const { upload, uploadPDF, getDocument, servePDF } = require('../controllers/documentController');

// Upload PDF
router.post('/upload', upload.single('pdf'), uploadPDF);

// Get document info
router.get('/:id', getDocument);

// Serve PDF file
router.get('/:id/pdf', servePDF);

module.exports = router;