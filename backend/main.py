"""
AgroGuard AI - Backend FastAPI Application
Main application file with API endpoints
"""

import os
import shutil
from datetime import datetime, timedelta
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status, Header
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional

# Import local modules
from database import (
    init_db, seed_demo_user, create_user, get_user_by_email, get_user_by_id,
    save_prediction, get_user_predictions, get_prediction_by_id,
    save_report, get_user_reports, get_report_by_id
)
from auth import (
    hash_password, verify_password, create_access_token, verify_token
)
from model_loader import predict_disease, get_class_names
from utils.report_generator import generate_pdf_report, get_reports_directory

# Log TensorFlow / Keras versions at startup to help debug environment issues
try:
    import tensorflow as _tf
    tf_version = getattr(_tf, "__version__", "unknown")
except Exception:
    tf_version = "not-installed"

try:
    import keras as _keras  # type: ignore
    keras_version = getattr(_keras, "__version__", "unknown")
except Exception:
    keras_version = "not-installed"

print(f"[STARTUP] TensorFlow version: {tf_version}; Keras (standalone) version: {keras_version}")

# Initialize FastAPI app
app = FastAPI(
    title="AgroGuard AI",
    description="Plant Disease Detection API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory for uploads
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize database
init_db()
seed_demo_user()

# Pydantic models
class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str


class PredictionResponse(BaseModel):
    predicted_class: str
    predicted_class_display: str
    confidence: float
    treatment: str
    medicine: str
    prediction_id: int


class ReportResponse(BaseModel):
    id: int
    predicted_class: str
    confidence: float
    created_at: str


# Helper functions
def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AgroGuard AI",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest):
    """Register new user"""
    try:
        # Check if user already exists
        existing_user = get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password and create user
        password_hash = hash_password(request.password)
        user_id = create_user(request.email, request.username, password_hash)
        
        # Create access token
        access_token = create_access_token({"user_id": user_id, "email": request.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user_id,
            "username": request.username
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )


@app.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login user"""
    try:
        # Get user by email
        user = get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token({"user_id": user["id"], "email": user["email"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user["id"],
            "username": user["username"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Login failed: {str(e)}"
        )


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    """Predict plant disease from uploaded image"""
    try:
        print(f"[PREDICT] Received file: {file.filename}, content_type: {file.content_type}")
        
        # Get current user
        user = get_current_user(authorization)
        print(f"[PREDICT] User authenticated: {user['id']}")
        
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"[PREDICT] File saved to: {file_path}")
        
        # Predict disease
        print(f"[PREDICT] Running prediction...")
        result = predict_disease(file_path)
        print(f"[PREDICT] Prediction result: {result}")
        
        if not result["success"]:
            error_msg = result.get('error', 'Unknown error')
            print(f"[PREDICT] Prediction failed: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Prediction failed: {error_msg}"
            )
        
        # Save prediction to database
        prediction_id = save_prediction(
            user_id=user["id"],
            image_name=file.filename,
            predicted_class=result["predicted_class"],
            confidence=result["confidence"],
            treatment=result["treatment"],
            medicine=result["medicine"]
        )
        print(f"[PREDICT] Prediction saved with ID: {prediction_id}")
        
        return {
            "predicted_class": result["predicted_class"],
            "predicted_class_display": result["predicted_class_display"],
            "confidence": result["confidence"],
            "treatment": result["treatment"],
            "medicine": result["medicine"],
            "prediction_id": prediction_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[PREDICT] ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/reports")
async def get_reports(authorization: Optional[str] = Header(None)):
    """Get all reports for current user"""
    try:
        # Get current user
        user = get_current_user(authorization)
        
        # Get user reports
        reports = get_user_reports(user["id"])
        
        return {
            "success": True,
            "reports": reports
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch reports: {str(e)}"
        )


@app.get("/predictions")
async def get_predictions(authorization: Optional[str] = Header(None)):
    """Get all predictions for current user"""
    try:
        # Get current user
        user = get_current_user(authorization)
        
        # Get user predictions
        predictions = get_user_predictions(user["id"])
        
        return {
            "success": True,
            "total": len(predictions),
            "predictions": predictions
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch predictions: {str(e)}"
        )


@app.post("/generate-report/{prediction_id}")
async def generate_report(prediction_id: int, authorization: Optional[str] = Header(None)):
    """Generate PDF report for a prediction"""
    try:
        # Get current user
        user = get_current_user(authorization)
        
        # Get prediction
        prediction = get_prediction_by_id(prediction_id)
        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found"
            )
        
        if prediction["user_id"] != user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized access to this prediction"
            )
        
        # Get image path
        image_path = os.path.join(UPLOAD_DIR, prediction["image_name"])
        
        # Generate PDF report
        filename, filepath = generate_pdf_report(
            username=user["username"],
            image_path=image_path,
            predicted_class=prediction["predicted_class"],
            predicted_class_display=prediction["predicted_class"],
            confidence=prediction["confidence"],
            treatment=prediction["treatment"],
            medicine=prediction["medicine"],
            date=prediction["created_at"]
        )
        
        # Save report to database
        report_id = save_report(user["id"], prediction_id, filepath)
        
        return {
            "success": True,
            "report_id": report_id,
            "filename": filename,
            "message": "Report generated successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Report generation failed: {str(e)}"
        )


@app.get("/download-report/{report_id}")
async def download_report(report_id: int, authorization: Optional[str] = Header(None)):
    """Download PDF report"""
    try:
        # Get current user
        user = get_current_user(authorization)
        
        # Get report
        report = get_report_by_id(report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        if report["user_id"] != user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized access to this report"
            )
        
        # Check if file exists
        if not os.path.exists(report["file_path"]):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report file not found"
            )
        
        # Return file
        return FileResponse(
            report["file_path"],
            media_type="application/pdf",
            filename=os.path.basename(report["file_path"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Download failed: {str(e)}"
        )


@app.get("/user-stats")
async def get_user_stats(authorization: Optional[str] = Header(None)):
    """Get user statistics"""
    try:
        # Get current user
        user = get_current_user(authorization)
        
        # Get predictions
        predictions = get_user_predictions(user["id"])
        
        # Calculate stats
        total_predictions = len(predictions)
        
        # Find most common disease
        most_common_disease = None
        disease_counts = {}
        for pred in predictions:
            disease = pred["predicted_class"]
            disease_counts[disease] = disease_counts.get(disease, 0) + 1
        
        if disease_counts:
            most_common_disease = max(disease_counts, key=disease_counts.get)
        
        return {
            "success": True,
            "total_predictions": total_predictions,
            "most_common_disease": most_common_disease,
            "disease_counts": disease_counts
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
