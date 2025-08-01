from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import os
import pandas as pd
import threading

# === Set up paths ===
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# === Initialize Flask app ===
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)
CORS(app)

# === Global variables for the model ===
model = None
feature_names = []
label_encoder = None

# === Background model loading function ===
def load_model_once():
    global model, feature_names, label_encoder
    try:
        print("[INFO] Loading model in background...")
        model_path = os.path.join("model", "triage_random_forest_model.pkl")  
        label_path = os.path.join(BASE_DIR, "model", "label_encoder.pkl")
        model, feature_names = joblib.load(model_path)
        if os.path.exists(label_path):
            label_encoder = joblib.load(label_path)
        print("[INFO] Model loaded successfully.")
    except Exception as e:
        print("[ERROR] Failed to load model:", e)

# Start model loading in a background thread
threading.Thread(target=load_model_once, daemon=True).start()

# === Fallback label mapping if a label encoder isn't available ===
triage_mapping = {0: "Black", 1: "Green", 2: "Yellow", 3: "Orange", 4: "Red"}

@app.route("/", methods=["GET"])
def home():
    return render_template("bot.html")

@app.route("/api/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model is still loading. Please try again in a few seconds."}), 503
    try:
        data = request.get_json()
        symptoms_input = data.get("symptoms", "").strip().lower()

        if not symptoms_input:
            return jsonify({"error": "No symptoms provided"}), 400

        symptoms_set = set(symptoms_input.replace(",", " ").split())
        input_vector = [1 if feature in symptoms_set else 0 for feature in feature_names]
        features_df = pd.DataFrame([input_vector], columns=feature_names)

        # Make prediction
        prediction = int(model.predict(features_df)[0])  # Ensure it's a native Python int

        # Use custom mapping instead of label_encoder
        prediction_label = triage_mapping.get(prediction, str(prediction))

        return jsonify({
            "triage_code": prediction,              # e.g. 3
            "triage_category": prediction_label     # e.g. "Orange"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Server running at http://127.0.0.1:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)
