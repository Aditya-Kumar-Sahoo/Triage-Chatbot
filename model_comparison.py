import pandas as pd
import time
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")

# === Load dataset ===
df = pd.read_csv("triage_data_synthetic_50000.csv")
df.columns = df.columns.str.strip()
df.rename(columns={"Triage Category": "triage"}, inplace=True)

# === Separate features and labels ===
X = df.drop(columns=["triage"])
y = df["triage"]

# Encode labels if needed
if y.dtype == object:
    le = LabelEncoder()
    y = le.fit_transform(y)

# Normalize features for models that need it (e.g., LogisticRegression)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# === Split for confusion matrix visualization ===
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# === Define models (ordered by typical training speed) ===
models = {
    "Decision Tree": DecisionTreeClassifier(),
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(n_estimators=100),
    "Gradient Boosting": GradientBoostingClassifier()
}

print("🔁 Training models (fastest to slowest):\n")

# === Train & evaluate each model ===
for name, model in models.items():
    start = time.time()
    scores = cross_val_score(model, X_scaled, y, cv=5, scoring="accuracy")
    end = time.time()
    print(f"{name:<20} Accuracy: {scores.mean():.4f} | Time: {end - start:.2f}s")

# === Final model for confusion matrix ===
final_model = GradientBoostingClassifier()
final_model.fit(X_train, y_train)
y_pred = final_model.predict(X_test)

# === Confusion matrix ===
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix - Gradient Boosting")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.show()
