const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    extractedText: {
        type: String,
        default: ''
    },
    pageCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Document', documentSchema);