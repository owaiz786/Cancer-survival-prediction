# --- START OF FILE train_and_save_models.py ---

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline

# For sksurv models (RSF)
from sksurv.ensemble import RandomSurvivalForest

# For DeepSurv model (Keras/TensorFlow)
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

print("Starting model training and saving process...")

# --- 1. Generate Synthetic Patient Data ---
# In your real project, you would load your data here, e.g., pd.read_csv('your_data.csv')
print("Generating synthetic data...")
np.random.seed(42)
n_patients = 200
data = {
    'age': np.random.randint(40, 80, n_patients),
    'tumor_stage': np.random.choice(['I', 'II', 'III', 'IV'], n_patients),
    'treatment_type': np.random.choice(['A', 'B'], n_patients),
    'lymph_node_status': np.random.randint(0, 10, n_patients),
    'time_to_event': np.random.randint(1, 100, n_patients), # Survival time in months
    'event_observed': np.random.choice([0, 1], n_patients)  # 0=Censored, 1=Event (e.g., death)
}
df = pd.DataFrame(data)

# Define feature types
categorical_features = ['tumor_stage', 'treatment_type']
numerical_features = ['age', 'lymph_node_status']
features = categorical_features + numerical_features
X = df[features]
y = np.array(list(zip(df['event_observed'], df['time_to_event'])), dtype=[('event', bool), ('time', float)])


# --- 2. Create and Save the Preprocessor ---
print("Creating and saving the preprocessor...")
# Create a pipeline for preprocessing
# One-hot encode categorical features, and scale numerical features
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Save the preprocessor to a .pkl file
with open('preprocessor.pkl', 'wb') as f:
    pickle.dump(preprocessor, f)
print("-> preprocessor.pkl saved successfully.")


# --- 3. Train and Save the Random Survival Forest Model ---
print("\nTraining and saving the RSF model...")
X_processed = preprocessor.fit_transform(X) # Preprocess data for training

rsf_model = RandomSurvivalForest(n_estimators=100, random_state=42)
rsf_model.fit(X_processed, y)

# Save the trained RSF model to a .pkl file
with open('rsf_model.pkl', 'wb') as f:
    pickle.dump(rsf_model, f)
print("-> rsf_model.pkl saved successfully.")


# --- 4. Train and Save the DeepSurv-like Model ---
# NOTE: This is a very simplified Keras model for demonstration. A real DeepSurv
# model requires a custom loss function (negative log partial likelihood).
print("\nTraining and saving the DeepSurv-like Keras model...")

deepsurv_model = Sequential([
    Dense(64, activation='relu', input_shape=(X_processed.shape[1],)),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dropout(0.3),
    Dense(1, activation='linear') # Output is a single risk score
])

# For this example, we'll just save the architecture and random weights.
# In a real scenario, you would compile and fit the model.
# deepsurv_model.compile(optimizer='adam', loss=your_custom_survival_loss)
# deepsurv_model.fit(X_processed, y['time'], epochs=50)

# Save the Keras model to a .h5 file
deepsurv_model.save('deepsurv_model.h5')
print("-> deepsurv_model.h5 saved successfully.")


# --- What about cox_model.pkl? ---
# You would train and save it just like the RSF model.
# from sksurv.linear_model import CoxPHSurvivalAnalysis
# cox_model = CoxPHSurvivalAnalysis()
# cox_model.fit(X_processed, y)
# with open('cox_model.pkl', 'wb') as f:
#     pickle.dump(cox_model, f)
# print("\n-> Placeholder for cox_model.pkl created.")
# For now, we'll just copy the RSF model to act as a placeholder for the Cox model.
import shutil
shutil.copy('rsf_model.pkl', 'cox_model.pkl')
print("\nCreated a placeholder cox_model.pkl for demonstration.")


print("\nAll model files have been generated.")