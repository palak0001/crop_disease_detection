"""
Model loader module for AgroGuard AI
Load and manage Keras model
"""

import os
from typing import Dict, Any
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image

# ---------------- MODEL PATH RESOLUTION ---------------- #

env_path = os.getenv("MODEL_PATH")

backend_candidate = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "plant_disease_model.keras")
)

root_candidate = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "plant_disease_model.keras")
)

if env_path:
    MODEL_PATH = env_path
elif os.path.exists(backend_candidate):
    MODEL_PATH = backend_candidate
else:
    MODEL_PATH = root_candidate

# Global model instance
_model = None

# ---------------- CLASS NAMES ---------------- #

CLASS_NAMES = {
    "Pepper__bell___Bacterial_spot": "Pepper Bell Bacterial Spot",
    "Pepper__bell___healthy": "Pepper Bell Healthy",
    "Potato___Early_blight": "Potato Early Blight",
    "Potato___healthy": "Potato Healthy",
    "Potato___Late_blight": "Potato Late Blight",
    "Tomato___Bacterial_spot": "Tomato Bacterial Spot",
    "Tomato___Early_blight": "Tomato Early Blight",
    "Tomato___healthy": "Tomato Healthy",
    "Tomato___Late_blight": "Tomato Late Blight",
    "Tomato___Leaf_Mold": "Tomato Leaf Mold",
    "Tomato___Septoria_leaf_spot": "Tomato Septoria Leaf Spot",
    "Tomato___Spider_mites_Two_spotted_spider_mite": "Tomato Spider Mites",
    "Tomato___Target_Spot": "Tomato Target Spot",
    "Tomato___Tomato_mosaic_virus": "Tomato Mosaic Virus",
    "Tomato___Tomato_YellowLeaf__Curl_Virus": "Tomato Yellow Leaf Curl Virus",
}

# ---------------- DISEASE INFO ---------------- #

DISEASE_INFO = {
    "Pepper__bell___Bacterial_spot": {
        "treatment": "Remove affected leaves, improve air circulation, apply copper-based fungicides, ensure proper spacing between plants",
        "medicine": "Copper sulfate, Bordeaux mixture"
    },
    "Pepper__bell___healthy": {
        "treatment": "Maintain regular care, proper watering, and fertilization",
        "medicine": "No treatment needed"
    },
    "Potato___Early_blight": {
        "treatment": "Remove affected leaves, improve drainage, maintain proper spacing, apply fungicide early in season",
        "medicine": "Mancozeb, Chlorothalonil, Azoxystrobin"
    },
    "Potato___healthy": {
        "treatment": "Continue regular care and monitoring",
        "medicine": "No treatment needed"
    },
    "Potato___Late_blight": {
        "treatment": "Use resistant varieties, improve air circulation, apply fungicide, avoid overhead watering",
        "medicine": "Metalaxyl, Chlorothalonil, Fosetyl-Al"
    },
    "Tomato___Bacterial_spot": {
        "treatment": "Remove infected leaves, improve drainage, use drip irrigation, apply copper-based fungicides",
        "medicine": "Copper sulfate, Streptomycin"
    },
    "Tomato___Early_blight": {
        "treatment": "Remove lower leaves, improve air circulation, mulch soil, apply fungicide",
        "medicine": "Mancozeb, Chlorothalonil, Azoxystrobin"
    },
    "Tomato___healthy": {
        "treatment": "Continue regular monitoring and care",
        "medicine": "No treatment needed"
    },
    "Tomato___Late_blight": {
        "treatment": "Use resistant varieties, avoid overhead watering, apply fungicide preventively",
        "medicine": "Chlorothalonil, Fosetyl-Al, Metalaxyl-M"
    },
    "Tomato___Leaf_Mold": {
        "treatment": "Improve ventilation, reduce humidity, remove infected leaves, apply fungicide",
        "medicine": "Chlorothalonil, Sulfur, Triadimefon"
    },
    "Tomato___Septoria_leaf_spot": {
        "treatment": "Remove infected leaves, improve air circulation, apply fungicide, avoid wetting foliage",
        "medicine": "Mancozeb, Chlorothalonil, Azoxystrobin"
    },
    "Tomato___Spider_mites_Two_spotted_spider_mite": {
        "treatment": "Spray water to remove mites, use miticides, release predatory mites, reduce dust",
        "medicine": "Permethrin, Abamectin, Neem oil"
    },
    "Tomato___Target_Spot": {
        "treatment": "Remove infected leaves, improve air circulation, apply fungicide, use resistant varieties",
        "medicine": "Chlorothalonil, Mancozeb, Azoxystrobin"
    },
    "Tomato___Tomato_mosaic_virus": {
        "treatment": "Remove infected plants, control aphids, use virus-free seeds, sanitize tools",
        "medicine": "No chemical cure, prevention through clean culture"
    },
    "Tomato___Tomato_YellowLeaf__Curl_Virus": {
        "treatment": "Control whiteflies, use resistant varieties, remove infected plants, use netting",
        "medicine": "Insecticide for whitefly control"
    },
}

# ---------------- MODEL LOADER ---------------- #

def load_keras_model():
    global _model

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        print(f"Loading model from {MODEL_PATH}...")
        _model = load_model(MODEL_PATH, compile=False)
        print("Model loaded successfully!")

    return _model


# ---------------- IMAGE PREPROCESSING ---------------- #

def preprocess_image(image_path: str, target_size: tuple = (224, 224)) -> np.ndarray:
    img = keras_image.load_img(image_path, target_size=target_size)
    img_array = keras_image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# ---------------- PREDICTION ---------------- #

def predict_disease(image_path: str) -> Dict[str, Any]:
    try:
        model = load_keras_model()
        img_array = preprocess_image(image_path)

        predictions = model.predict(img_array, verbose=0)
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_idx])

        class_list = list(CLASS_NAMES.keys())
        predicted_class = class_list[predicted_idx]
        predicted_class_display = CLASS_NAMES.get(predicted_class, predicted_class)

        disease_info = DISEASE_INFO.get(
            predicted_class,
            {
                "treatment": "Consult agricultural expert",
                "medicine": "Unknown"
            }
        )

        return {
            "predicted_class": predicted_class,
            "predicted_class_display": predicted_class_display,
            "confidence": confidence,
            "treatment": disease_info.get("treatment", ""),
            "medicine": disease_info.get("medicine", ""),
            "success": True
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "predicted_class": None,
            "confidence": 0.0,
            "treatment": "",
            "medicine": ""
        }


def get_class_names() -> Dict[str, str]:
    return CLASS_NAMES
