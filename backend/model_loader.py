"""
Model loader module for AgroGuard AI
Load and manage Keras model
"""

import os
from typing import Dict, Any
import numpy as np
import tensorflow as tf
import keras
from keras.preprocessing import image as keras_image


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

_model = None


# ---------------- CLASS LIST (MUST MATCH TRAINING ORDER EXACTLY) ---------------- #

CLASS_LIST = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]


# ---------------- DISEASE INFO ---------------- #

DISEASE_INFO = {
    "Pepper__bell___Bacterial_spot": {
        "display_name": "Pepper Bell Bacterial Spot",
        "treatment": "Remove affected leaves and apply copper-based fungicides",
        "medicine": "Copper sulfate"
    },
    "Pepper__bell___healthy": {
        "display_name": "Pepper Bell Healthy",
        "treatment": "Maintain proper care",
        "medicine": "No treatment needed"
    },
    "Potato___Early_blight": {
        "display_name": "Potato Early Blight",
        "treatment": "Remove infected leaves and apply fungicide",
        "medicine": "Mancozeb"
    },
    "Potato___Late_blight": {
        "display_name": "Potato Late Blight",
        "treatment": "Improve air circulation and apply fungicide",
        "medicine": "Metalaxyl"
    },
    "Potato___healthy": {
        "display_name": "Potato Healthy",
        "treatment": "Continue monitoring",
        "medicine": "No treatment needed"
    },
    "Tomato_Bacterial_spot": {
        "display_name": "Tomato Bacterial Spot",
        "treatment": "Remove infected leaves",
        "medicine": "Copper sulfate"
    },
    "Tomato_Early_blight": {
        "display_name": "Tomato Early Blight",
        "treatment": "Remove lower leaves and apply fungicide",
        "medicine": "Mancozeb"
    },
    "Tomato_Late_blight": {
        "display_name": "Tomato Late Blight",
        "treatment": "Avoid overhead watering",
        "medicine": "Chlorothalonil"
    },
    "Tomato_Leaf_Mold": {
        "display_name": "Tomato Leaf Mold",
        "treatment": "Improve ventilation",
        "medicine": "Sulfur spray"
    },
    "Tomato_Septoria_leaf_spot": {
        "display_name": "Tomato Septoria Leaf Spot",
        "treatment": "Remove infected leaves",
        "medicine": "Mancozeb"
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "display_name": "Tomato Spider Mites",
        "treatment": "Spray water and use miticide",
        "medicine": "Neem oil"
    },
    "Tomato__Target_Spot": {
        "display_name": "Tomato Target Spot",
        "treatment": "Remove infected parts",
        "medicine": "Chlorothalonil"
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "display_name": "Tomato Yellow Leaf Curl Virus",
        "treatment": "Control whiteflies",
        "medicine": "Insecticide"
    },
    "Tomato__Tomato_mosaic_virus": {
        "display_name": "Tomato Mosaic Virus",
        "treatment": "Remove infected plants",
        "medicine": "No chemical cure"
    },
    "Tomato_healthy": {
        "display_name": "Tomato Healthy",
        "treatment": "Regular care",
        "medicine": "No treatment needed"
    }
}


# ---------------- MODEL LOADER ---------------- #

def load_keras_model():
    global _model

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        print(f"Loading model from {MODEL_PATH}...")

        _model = keras.models.load_model(MODEL_PATH, compile=False)

        print("Model loaded successfully!")

    return _model


# ---------------- IMAGE PREPROCESSING ---------------- #

def preprocess_image(image_path: str, target_size: tuple = (224, 224)) -> np.ndarray:

    img = keras_image.load_img(image_path, target_size=target_size)
    img_array = keras_image.img_to_array(img)

    # IMPORTANT
    # EfficientNet preprocessing already inside model
    img_array = img_array.astype("float32")

    img_array = np.expand_dims(img_array, axis=0)

    return img_array


# ---------------- PREDICTION ---------------- #

def predict_disease(image_path: str) -> Dict[str, Any]:

    try:

        model = load_keras_model()

        img_array = preprocess_image(image_path)

        raw_predictions = model.predict(img_array, verbose=0)[0]

        print("Raw prediction vector:")
        print(raw_predictions)

        probabilities = tf.nn.softmax(raw_predictions).numpy()

        predicted_idx = int(np.argmax(probabilities))

        confidence = float(probabilities[predicted_idx])

        predicted_class = CLASS_LIST[predicted_idx]

        class_data = DISEASE_INFO.get(predicted_class, {})

        return {
            "success": True,
            "predicted_class": predicted_class,
            "predicted_class_display": class_data.get("display_name", predicted_class),
            "confidence": round(confidence, 4),
            "treatment": class_data.get("treatment", ""),
            "medicine": class_data.get("medicine", "")
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


# ---------------- GET CLASS NAMES ---------------- #

def get_class_names():
    return CLASS_LIST