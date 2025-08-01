import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib
import os

# === Load dataset ===
csv_path = "triage_data_synthetic_50000.csv"
df = pd.read_csv(csv_path)

# Clean column names
df.columns = df.columns.str.strip()
df.rename(columns={"Triage Category": "triage"}, inplace=True)

# Separate features and target
X = df.drop(columns=["triage"])
y = df["triage"]

# Label encoding for target
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Accuracy: {accuracy:.4f}\n")

# Classification Report
target_names = [str(cls) for cls in le.classes_]
print("📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=target_names))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 6))
sns.heatmap(cm, annot=True, fmt="d", xticklabels=target_names, yticklabels=target_names, cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()

# Save model and encoder
os.makedirs("model", exist_ok=True)
joblib.dump((model, list(X.columns)), "model/triage_random_forest_model.pkl")
joblib.dump(le, "model/label_encoder.pkl")

print("✅ Model and encoder saved to 'model/' folder.")
