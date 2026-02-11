"""
Database module for AgroGuard AI
SQLite database initialization and operations
"""

import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict, Any

DATABASE_PATH = "agroguard.db"


def get_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables"""
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Predictions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_name TEXT NOT NULL,
            predicted_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            treatment TEXT,
            medicine TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            prediction_id INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (prediction_id) REFERENCES predictions(id)
        )
    """)

    conn.commit()
    conn.close()


def seed_demo_user():
    """Create demo user if it doesn't exist"""
    from auth import hash_password
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", ("demo@agroguard.com",))
    user = cursor.fetchone()
    
    if not user:
        # Hash the password
        password_hash = hash_password("demo123")
        
        cursor.execute(
            "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
            ("demo@agroguard.com", "demo_user", password_hash)
        )
        conn.commit()
        print("✓ Demo user created: demo@agroguard.com / demo123")
    else:
        print("✓ Demo user already exists")
    
    conn.close()


def create_user(email: str, username: str, password_hash: str) -> int:
    """Create a new user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        (email, username, password_hash)
    )
    
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    return user_id


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get user by email"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    return dict(user) if user else None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user by ID"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    return dict(user) if user else None


def save_prediction(
    user_id: int,
    image_name: str,
    predicted_class: str,
    confidence: float,
    treatment: str,
    medicine: str
) -> int:
    """Save prediction to database"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """INSERT INTO predictions 
           (user_id, image_name, predicted_class, confidence, treatment, medicine)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (user_id, image_name, predicted_class, confidence, treatment, medicine)
    )
    
    conn.commit()
    prediction_id = cursor.lastrowid
    conn.close()
    
    return prediction_id


def get_user_predictions(user_id: int) -> List[Dict[str, Any]]:
    """Get all predictions for a user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,)
    )
    predictions = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return predictions


def get_prediction_by_id(prediction_id: int) -> Optional[Dict[str, Any]]:
    """Get prediction by ID"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM predictions WHERE id = ?", (prediction_id,))
    prediction = cursor.fetchone()
    conn.close()
    
    return dict(prediction) if prediction else None


def save_report(user_id: int, prediction_id: int, file_path: str) -> int:
    """Save report to database"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO reports (user_id, prediction_id, file_path) VALUES (?, ?, ?)",
        (user_id, prediction_id, file_path)
    )
    
    conn.commit()
    report_id = cursor.lastrowid
    conn.close()
    
    return report_id


def get_user_reports(user_id: int) -> List[Dict[str, Any]]:
    """Get all reports for a user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT reports.*, predictions.predicted_class, predictions.confidence
           FROM reports
           JOIN predictions ON reports.prediction_id = predictions.id
           WHERE reports.user_id = ?
           ORDER BY reports.created_at DESC""",
        (user_id,)
    )
    reports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return reports


def get_report_by_id(report_id: int) -> Optional[Dict[str, Any]]:
    """Get report by ID"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM reports WHERE id = ?", (report_id,))
    report = cursor.fetchone()
    conn.close()
    
    return dict(report) if report else None
