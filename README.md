# AgroGuard AI - Plant Disease Detection System

A complete full-stack web application for detecting plant diseases using AI technology. This application uses a deep learning model trained on plant images to identify diseases and provide treatment recommendations.

![AgroGuard AI](https://img.shields.io/badge/AgroGuard-AI-success)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![Keras](https://img.shields.io/badge/Keras-2.14-red)

## 🌟 Features

### Backend
- ✅ FastAPI REST API with modern async support
- ✅ TensorFlow/Keras model for plant disease detection
- ✅ JWT-based authentication with password hashing
- ✅ SQLite database for persistent storage
- ✅ PDF report generation with reportlab
- ✅ CORS enabled for frontend integration
- ✅ Production-ready error handling

### Frontend
- ✅ React with Vite for fast development
- ✅ Modern UI with Tailwind CSS styling
- ✅ Framer Motion animations
- ✅ Drag & drop image upload
- ✅ Protected routes with authentication
- ✅ Real-time prediction results
- ✅ PDF report download
- ✅ Responsive mobile design

### Supported Diseases
- **Potato**: Early Blight, Late Blight, Healthy
- **Tomato**: Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Bacterial Spot, Target Spot, Mosaic Virus, Yellow Leaf Curl Virus, Healthy
- **Bell Pepper**: Bacterial Spot, Healthy

## 📦 Project Structure

```
edit_crop/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── auth.py                 # JWT authentication
│   ├── database.py             # SQLite database setup
│   ├── model_loader.py         # Keras model loading
│   ├── requirements.txt         # Python dependencies
│   ├── utils/
│   │   ├── __init__.py
│   │   └── report_generator.py # PDF generation
│   ├── static/
│   │   ├── uploads/            # Uploaded images
│   │   └── reports/            # Generated reports
│   └── plant_disease_model.keras
│
└── frontend/
    ├── src/
    │   ├── main.jsx            # React entry point
    │   ├── App.jsx             # Main app component
    │   ├── index.css           # Global styles
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Predict.jsx
    │   │   ├── Reports.jsx
    │   │   └── About.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   └── services/
    │       └── api.js
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- The trained Keras model file (`plant_disease_model.keras`)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Make sure the model file exists**
   ```bash
   # Place plant_disease_model.keras in the root directory
   # It should be at: edit_crop/plant_disease_model.keras
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (already included as `.env.local`)
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token

### Predictions
- `POST /predict` - Upload image and get disease prediction
- `GET /predictions` - Get all predictions for user
- `GET /user-stats` - Get user statistics

### Reports
- `POST /generate-report/{prediction_id}` - Generate PDF report
- `GET /reports` - Get all reports for user
- `GET /download-report/{report_id}` - Download PDF report

### Health
- `GET /health` - Health check endpoint

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in browser's localStorage
4. Token is included in Authorization header for protected routes
5. Token expires after 30 minutes of inactivity

### Demo Credentials
```
Email: demo@agroguard.com
Password: demo123
```

## 🎨 UI/UX Features

- **Modern Design**: Green gradient agriculture theme
- **Glassmorphism**: Modern glass effect cards
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Works on desktop, tablet, and mobile
- **Loading States**: Animated spinners and progress bars
- **Error Handling**: Beautiful error alerts and notifications
- **Drag & Drop**: Easy image upload with preview
- **PDF Reports**: Download comprehensive disease reports

## 📱 Pages

### Login Page
- Email and password authentication
- Register link for new users
- Error handling with validation

### Register Page
- Username, email, and password fields
- Password confirmation
- Email validation
- Login link for existing users

### Dashboard
- Welcome message with user's username
- Statistics cards showing:
  - Total predictions made
  - Most common disease detected
  - Recent reports count
- Recent predictions table with disease, confidence, and date

### Predict Page
- Drag and drop image upload area
- Image preview before prediction
- AI-powered disease detection
- Results showing:
  - Disease name
  - Confidence score (%)
  - Treatment recommendations
  - Suggested medicine
- PDF report download button

### Reports Page
- Table/Grid of all generated reports
- Disease name and confidence for each report
- Date created
- Download PDF button for each report

### About Page
- Mission statement and company information
- Feature highlights
- How it works (step-by-step process)
- Supported crops and diseases
- Call-to-action button

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **ML**: TensorFlow, Keras
- **Database**: SQLite with Python sqlite3
- **Authentication**: JWT, Passlib, bcrypt
- **PDF Generation**: ReportLab
- **HTTP**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Lucide React

## 🚀 Production Deployment

### Backend
1. Update `SECRET_KEY` in `auth.py`
2. Set `CORS` origins to your domain
3. Use environment variables for sensitive data
4. Deploy with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

### Frontend
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to a static hosting service

## 📊 Model Information

The Keras model (`plant_disease_model.keras`) should:
- Accept 224x224 RGB images as input
- Output class probabilities for plant diseases
- Be trained on plant leaf images
- Support at least 15 disease classes

## 🔍 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP
)
```

### Predictions Table
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    image_name TEXT,
    predicted_class TEXT,
    confidence REAL,
    treatment TEXT,
    medicine TEXT,
    created_at TIMESTAMP
)
```

### Reports Table
```sql
CREATE TABLE reports (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    prediction_id INTEGER,
    file_path TEXT,
    created_at TIMESTAMP
)
```

## 🐛 Troubleshooting

### Backend Issues

**Model not found error**
- Ensure `plant_disease_model.keras` is in the root directory
- Check file path in `model_loader.py`

**CORS errors**
- Frontend and backend must be running on different ports
- CORS is enabled for all origins in development

**Database locked**
- Delete `agroguard.db` and restart the backend

### Frontend Issues

**API connection errors**
- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `.env.local`

**Module not found**
- Run `npm install` to install missing dependencies
- Clear `node_modules` and reinstall if issues persist

## 📝 Environment Variables

### Backend
No special environment variables needed for basic setup.

### Frontend
```
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## 🤝 Contributing

Contributions are welcome! Please follow PEP 8 style for Python and Prettier for JavaScript.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

## 🎯 Future Enhancements

- [ ] Real-time webcam detection
- [ ] Batch image processing
- [ ] Training progress dashboard
- [ ] More plant species support
- [ ] Mobile app using React Native
- [ ] Offline functionality
- [ ] Multi-language support
- [ ] Expert user consultation booking

## ✨ Credits

Built with ❤️ using FastAPI, React, and TensorFlow
