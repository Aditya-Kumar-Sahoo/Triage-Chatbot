import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib
import os

# Load and prepare data
df = pd.read_csv("triage_data_synthetic_50000.csv")
df.columns = df.columns.str.strip()
df.rename(columns={"Triage Category": "triage"}, inplace=True)
X = df.drop(columns=["triage"])
y = df["triage"]

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)

# Train Logistic Regression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Evaluation
acc = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy: {acc:.4f}")
print("📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=[str(c) for c in le.classes_]))

cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=le.classes_, yticklabels=le.classes_)
plt.title("Logistic Regression - Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.show()

# Save model, encoder, scaler
os.makedirs("model", exist_ok=True)
joblib.dump((model, list(X.columns)), "model/logistic_regression_model.pkl")
joblib.dump(le, "model/label_encoder.pkl")
joblib.dump(scaler, "model/standard_scaler.pkl")
print("💾 Model, encoder, and scaler saved.")
