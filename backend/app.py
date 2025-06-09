from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import os
from models.cox_model import CoxModel
from models.rsf_model import RandomSurvivalForestModel
from models.deepsurv_model import DeepSurvModel
from utils.data_preprocessing import preprocess_input
from utils.shap_explainer import generate_shap_values
from models.kaplan_meier import KaplanMeierModel

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'data/trained_models')

# Initialize models
cox_model = CoxModel(model_path=os.path.join(MODEL_DIR, 'cox_model.pkl'))
rsf_model = RandomSurvivalForestModel(model_path=os.path.join(MODEL_DIR, 'rsf_model.pkl'))
deepsurv_model = DeepSurvModel(model_path=os.path.join(MODEL_DIR, 'deepsurv_model.h5'))

# Load preprocessor
with open(os.path.join(MODEL_DIR, 'preprocessor.pkl'), 'rb') as f:
    preprocessor = pickle.load(f)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Preprocess input data
        processed_data = preprocess_input(data, preprocessor)
        
        # Make predictions with each model
        cox_prediction = cox_model.predict(processed_data)
        rsf_prediction = rsf_model.predict(processed_data)
        deepsurv_prediction = deepsurv_model.predict(processed_data)
        
        # Calculate feature importance using SHAP
        feature_importance = generate_shap_values(processed_data, rsf_model)
        
        # Determine best model based on validation C-index
        model_comparison = {
            'cox': {
                'cIndex': cox_model.get_c_index(),
                'prediction': cox_prediction['median_survival']
            },
            'rsf': {
                'cIndex': rsf_model.get_c_index(),
                'prediction': rsf_prediction['median_survival']
            },
            'deepsurv': {
                'cIndex': deepsurv_model.get_c_index(),
                'prediction': deepsurv_prediction['median_survival']
            }
        }
        
        # Use the best model's prediction
        best_model = max(model_comparison, key=lambda k: model_comparison[k]['cIndex'])
        best_prediction = model_comparison[best_model]['prediction']
        
        # Calculate risk score (normalized between 0-1)
        risk_score = 1 - (rsf_prediction['survival_probability_24m'] / 100)
        
        # Prepare response
        response = {
            'patientId': f"PATIENT-{pd.Timestamp.now().strftime('%Y%m%d%H%M%S')}",
            'survivalProbability': rsf_prediction['survival_probability_24m'] / 100,
            'riskScore': risk_score,
            'predictedSurvivalMonths': best_prediction,
            'modelComparison': model_comparison,
            'featureImportance': feature_importance,
            'inputData': data
        }

        # Generate Kaplan-Meier estimation for risk stratification
        km_model = KaplanMeierModel()

        # Create synthetic survival data for the patient's risk group
        # This would normally come from your training data
        np.random.seed(42)  # For reproducible results
        n_patients = 100

        # Generate survival times based on risk score
        base_survival = 36  # Base survival time
        risk_factor = 1 - risk_score
        survival_times = np.random.exponential(base_survival * risk_factor, n_patients)
        event_indicators = np.random.binomial(1, 0.7, n_patients)  # 70% event rate

        # Fit Kaplan-Meier model
        km_model.fit(survival_times, event_indicators, label=f"Risk Group")

        # Get Kaplan-Meier predictions
        km_predictions = km_model.predict_survival_function()

        # Add Kaplan-Meier data to response
        response['kaplanMeier'] = {
            'medianSurvival': km_model.get_median_survival(),
            'survivalCurve': [
                {
                    'month': int(t),
                    'survival': float(s),
                    'upper_ci': float(u),
                    'lower_ci': float(l)
                }
                for t, s, u, l in zip(
                    km_predictions['times'],
                    km_predictions['survival_probabilities'],
                    km_predictions['upper_confidence'],
                    km_predictions['lower_confidence']
                )
            ]
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def process_file():
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Read CSV file
        df = pd.read_csv(file)
        
        # Process each patient in the file
        results = []
        for _, row in df.iterrows():
            # Convert row to dictionary
            patient_data = row.to_dict()
            
            # Preprocess data
            processed_data = preprocess_input(patient_data, preprocessor)
            
            # Make predictions
            rsf_prediction = rsf_model.predict(processed_data)
            
            # Calculate risk score
            risk_score = 1 - (rsf_prediction['survival_probability_24m'] / 100)
            
            # Add to results
            results.append({
                'patientId': patient_data.get('patient_id', f"PATIENT-{len(results)+1}"),
                'survivalProbability': rsf_prediction['survival_probability_24m'] / 100,
                'riskScore': risk_score,
                'predictedSurvivalMonths': rsf_prediction['median_survival']
            })
        
        # Calculate summary statistics
        high_risk = sum(1 for r in results if r['riskScore'] > 0.6)
        medium_risk = sum(1 for r in results if 0.3 <= r['riskScore'] <= 0.6)
        low_risk = sum(1 for r in results if r['riskScore'] < 0.3)
        
        # Prepare batch response
        response = {
            'fileName': file.filename,
            'totalPatients': len(results),
            'processedAt': pd.Timestamp.now().isoformat(),
            'summary': {
                'averageSurvivalMonths': np.mean([r['predictedSurvivalMonths'] for r in results]),
                'highRiskPatients': high_risk,
                'mediumRiskPatients': medium_risk,
                'lowRiskPatients': low_risk
            },
            'modelPerformance': {
                'cox': {'cIndex': cox_model.get_c_index()},
                'rsf': {'cIndex': rsf_model.get_c_index()},
                'deepsurv': {'cIndex': deepsurv_model.get_c_index()}
            },
            'topFeatures': generate_shap_values(None, rsf_model, top_n=5),
            'patients': results
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
