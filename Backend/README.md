# Google NotebookLM Clone - Backend

A Node.js Express backend that handles PDF uploads, text extraction, and AI-powered chat functionality using Google Gemini API.

## ?? Features

- PDF Upload & Text Extraction
- MongoDB Integration (Pre-configured)
- Google Gemini AI Integration (Pre-configured)
- RESTful API
- CORS Configuration
- File Upload with Multer

## ?? Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** package manager

## ??? Installation & Setup

### Step 1: Extract the Zip File
```bash
# Extract the downloaded zip file
# Navigate to the extracted folder
cd google-notebooklm-clone
```

### Step 2: Navigate to Backend Directory
```bash
cd Backend
```

### Step 3: Install Dependencies
```bash
npm install
```

**If you encounter any issues, try:**
```bash
npm install --legacy-peer-deps
```

### Step 4: Environment Configuration

The `.env` file is already provided in the Backend directory with all necessary configurations:

```env
DATABASE=mongodb+srv://sorathiyapooja33:pooja2133@cluster0.isq3lgr.mongodb.net/googles?retryWrites=true&w=majority&appName=Cluster0
PORT=8000
GEMINI_API_KEY=AIzaSyD5j4kFfFXNrXzUlpSUtSYZj7YWfe71CfI
```

**? MongoDB Atlas Database - Already configured and ready to use**
**? Google Gemini API - Already configured and ready to use**
**? No additional setup required!**

### Step 5: Start the Server

```bash
nodemon server.js
```

The server will start on `http://localhost:8000`

## ?? Configuration

### Changing Backend Port

If you want to change the backend port, update `.env` file:
```env
PORT=5000  # Change to your desired port
```

**Important:** If you change the backend port, also update the frontend API configuration in `Frontend/src/api/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000'; // Update to match your backend port
```

### CORS Configuration

If your frontend runs on a different port, update `server.js`:

```javascript
const corsOptions = {
    origin: ["http://localhost:5173"], // Change to your frontend URL
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    optionsSuccessStatus: 200
};
```

## ?? Project Structure

```
Backend/
??? controllers/       # Route controllers
??? models/           # MongoDB models
??? routes/           # API routes
??? db/               # Database connection
??? uploads/          # Uploaded PDF files
??? server.js         # Main server file
??? package.json      # Dependencies
??? .env             # Environment variables (pre-configured)
```

## ?? API Endpoints

### Documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/pdf` - Serve PDF file

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/:chatId` - Get chat history

### Health Check
- `GET /api/health` - Server status

## ?? Troubleshooting

### Common Issues:

1. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE :::8000
   ```
   **Solution:**
   - Change PORT in `.env` file
   - Kill existing process:
     - Mac/Linux: `lsof -ti:8000 | xargs kill -9`
     - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`

2. **CORS Error**
   ```bash
   Access to fetch blocked by CORS policy
   ```
   **Solution:**
   - Update CORS origin in `server.js`
   - Ensure frontend URL matches CORS configuration

3. **Dependencies Issues**
   ```bash
   npm ERR! peer dep missing
   ```
   **Solution:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

4. **MongoDB Connection Issues**
   ```bash
   MongooseError: Could not connect
   ```
   **Solution:**
   - Check internet connection
   - The database is pre-configured and should work automatically

5. **Nodemon Not Found**
   ```bash
   'nodemon' is not recognized
   ```
   **Solution:**
   ```bash
   npm install -g nodemon
   ```

## ?? Pre-configured Services

| Service | Status | Details |
|---------|--------|---------|
| **MongoDB Atlas** | ? Ready | Database connection pre-configured |
| **Google Gemini API** | ? Ready | AI service pre-configured |
| **CORS** | ? Ready | Configured for localhost:5173 |
| **File Upload** | ? Ready | Multer configured for PDF uploads |

## ?? Quick Start

```bash
# Extract zip file and navigate
cd google-notebooklm-clone/Backend

# Install dependencies
npm install

# Start development server
nodemon server.js

# Server will start on http://localhost:8000
```


## ?? Support

If you encounter any issues:

1. **Check if all dependencies are installed:**
   ```bash
   npm list
   ```

2. **Check if nodemon is installed:**
   ```bash
   npm list nodemon
   ```

3. **Test server startup:**
   ```bash
   nodemon server.js  # Check console for errors
   ```

4. **Common Solutions:**
   - Restart the server
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
