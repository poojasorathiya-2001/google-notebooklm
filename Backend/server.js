const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


require('./db/Conn');
const app = express();

// CORS configuration
const corsOptions = {
    origin: ["https://google-notebooklm.vercel.app"],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notebooklm', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log('MongoDB cronnection error:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
