import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score

# Load dataset using pandas
# Replace 'triage_data_synthetic_50000.csv' with the path to your dataset
data = pd.read_csv('triage_data_synthetic_50000.csv')

# Inspect the first few rows of the data
print(data.head())

# Separate features (X) and labels (y)
X = data.iloc[:, :-1]  # All columns except the last one (features)
y = data.iloc[:, -1]   # Last column (labels)

# Handle categorical data if necessary (for example, using one-hot encoding)
X = pd.get_dummies(X)

# Split the data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize RandomForestClassifier
rf = RandomForestClassifier(random_state=42)

# Define the parameter grid for GridSearchCV
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['auto', 'sqrt']
}

# Initialize GridSearchCV
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=2)

# Fit the model
grid_search.fit(X_train, y_train)

# Get the best parameters and best score
print("Best parameters:", grid_search.best_params_)
print("Best score:", grid_search.best_score_)

# Get the best model and use it for prediction
best_rf = grid_search.best_estimator_
predictions = best_rf.predict(X_test)

# Evaluate the model's performance on the test data
print("Test accuracy:", accuracy_score(y_test, predictions))
