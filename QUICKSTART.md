# AgroGuard AI - Quick Start Guide

## Windows Users

### Backend Setup (Windows)

1. **Open PowerShell or Command Prompt**

2. **Navigate to backend directory**
   ```powershell
   cd backend
   ```

3. **Create virtual environment**
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Start backend server**
   ```powershell
   python main.py
   ```

   ✅ Backend running at: http://localhost:8000
   📚 API Docs at: http://localhost:8000/docs

### Frontend Setup (Windows)

1. **Open new PowerShell/Command Prompt window**

2. **Navigate to frontend directory**
   ```powershell
   cd frontend
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

4. **Start frontend server**
   ```powershell
   npm run dev
   ```

   ✅ Frontend running at: http://localhost:5173

### Access the Application

Open your browser and go to: **http://localhost:5173**

### Demo Login
- Email: `demo@agroguard.com`
- Password: `demo123`

---

## Mac Users

### Backend Setup (Mac)

1. **Open Terminal**

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start backend server**
   ```bash
   python main.py
   ```

   ✅ Backend running at: http://localhost:8000

### Frontend Setup (Mac)

1. **Open new Terminal window**

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start frontend server**
   ```bash
   npm run dev
   ```

   ✅ Frontend running at: http://localhost:5173

---

## Linux Users

### Backend Setup (Linux)

1. **Open Terminal**

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start backend server**
   ```bash
   python main.py
   ```

### Frontend Setup (Linux)

1. **Open new Terminal window**

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start frontend server**
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### Backend won't start

**Error: "plant_disease_model.keras not found"**
- Make sure the model file is in the root directory of the project
- Path should be: `edit_crop/plant_disease_model.keras`

**Error: "Port 8000 already in use"**
- Kill the process using port 8000:
  - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -i :8000` then `kill -9 <PID>`

**Error: "Module not found"**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Frontend won't start

**Error: "npm: command not found"**
- Install Node.js from https://nodejs.org/

**Error: "Port 5173 already in use"**
- Kill the process using port 5173
- Or change the port in vite.config.js

**Error: "Cannot find module"**
- Run `npm install` again
- Delete `node_modules` folder and reinstall

### API connection error

- Make sure backend is running at http://localhost:8000
- Check that CORS is enabled
- Open http://localhost:8000/docs to verify API is working

---

## Features to Try

1. **Register a new account** (or use demo credentials)
2. **Upload a plant image** on the Predict page
3. **View prediction results** with disease name and confidence
4. **Download PDF report** of the prediction
5. **View statistics** on Dashboard
6. **Check past reports** on Reports page

---

## Project Structure

```
edit_crop/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── model_loader.py
│   ├── requirements.txt
│   ├── utils/
│   │   └── report_generator.py
│   └── static/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## Important Notes

⚠️ **Security**: This is a development setup. For production:
- Change `SECRET_KEY` in `auth.py`
- Use environment variables
- Enable HTTPS
- Set proper CORS origins
- Use a production database

✅ **Database**: SQLite database (`agroguard.db`) is created automatically

✅ **Uploads**: Image uploads are stored in `backend/static/uploads/`

✅ **Reports**: Generated PDF reports are stored in `backend/static/reports/`

---

## Need Help?

Check the main README.md for detailed documentation:
- API endpoints
- Database schema
- Technology stack
- Deployment guide
- Troubleshooting
