# Flask Model Integration Setup

This guide explains how to run your trained Flask model alongside the React frontend.

## Setup Instructions

### 1. Start Your Flask Model Server

Save your Flask code to a file (e.g., `flask_model_server.py`) and run it on port 8081:

```python
# Update the port in your Flask code to avoid conflicts
if __name__ == "__main__":
    print("🚀 Flask Model Server running at http://127.0.0.1:8081")
    app.run(host="0.0.0.0", port=8081, debug=True)  # Changed from 8080 to 8081
```

Then run:
```bash
python flask_model_server.py
```

### 2. Start the React Frontend Server

In this project directory:
```bash
npm run dev
```

The frontend will run on port 8080 and automatically call your Flask model API.

## How It Works

1. **User enters symptoms** in the React frontend
2. **Frontend sends request** to Express server (`/api/triage`)
3. **Express server calls** your Flask model API (`http://localhost:8081/api/predict`)
4. **Flask model processes** symptoms and returns prediction
5. **Express server maps** Flask response to frontend format
6. **Frontend displays** the triage result with colors and emojis

## API Flow

```
Frontend → Express (/api/triage) → Flask (/api/predict) → ML Model
                ↓
           Formatted Response ← Mapped Response ← Raw Prediction
```

## Configuration

### Environment Variables

Set the Flask API URL in `.env`:
```
FLASK_API_URL=http://localhost:8081
```

### Model Response Mapping

Your Flask API returns:
```json
{
  "triage_code": 3,
  "triage_category": "Orange"
}
```

This gets mapped to:
```json
{
  "category": "Orange",
  "severity": 3,
  "emoji": "🟠",
  "description": "Urgent - Should be seen within 30 minutes"
}
```

## Troubleshooting

### Port Conflicts
- Frontend (React/Express): Port 8080
- Flask Model: Port 8081
- Make sure both ports are available

### CORS Issues
Your Flask code already includes `CORS(app)`, which should handle cross-origin requests.

### Model Loading
If you see "Model is still loading" errors, wait a few seconds for your Flask server to load the model in the background.

### Fallback Behavior
If the Flask API is unavailable, the system automatically falls back to a rule-based prediction system.

## Testing

You can test your Flask API directly:
```bash
curl -X POST http://localhost:8081/api/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "chest pain, difficulty breathing"}'
```

Expected response:
```json
{
  "triage_code": 4,
  "triage_category": "Red"
}
```
