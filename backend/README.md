# Cancer Survival Prediction Backend

This is the backend API for the Cancer Survival Prediction web application. It provides endpoints for predicting cancer patient survival using multiple machine learning models.

## Setup

1. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run the application:
\`\`\`bash
python app.py
\`\`\`

The API will be available at http://localhost:5000.

## API Endpoints

### Predict Survival

**Endpoint:** `/api/predict`
**Method:** POST
**Description:** Predicts survival for a single patient

**Request Body:**
\`\`\`json
{
  "age": 65,
  "gender": "female",
  "tumorStage": "II",
  "tumorSize": "2.3",
  "lymphNodes": "1",
  "histologicalGrade": "2",
  "erStatus": "positive",
  "prStatus": "positive",
  "her2Status": "negative",
  "treatmentHistory": "chemotherapy",
  "tp53Expression": "2.45",
  "brca1Expression": "1.23",
  "methylationScore": "0.67",
  "mirnaProfile": "3.21"
}
\`\`\`

**Response:**
\`\`\`json
{
  "patientId": "PATIENT-20230615123456",
  "survivalProbability": 0.78,
  "riskScore": 0.32,
  "predictedSurvivalMonths": 36.5,
  "modelComparison": {
    "cox": {
      "cIndex": 0.68,
      "prediction": 34.2
    },
    "rsf": {
      "cIndex": 0.72,
      "prediction": 36.5
    },
    "deepsurv": {
      "cIndex": 0.75,
      "prediction": 38.1
    }
  },
  "featureImportance": [
    {
      "feature": "Tumor Stage",
      "importance": 0.28
    },
    {
      "feature": "Age",
      "importance": 0.24
    },
    ...
  ]
}
\`\`\`

### Process File

**Endpoint:** `/api/upload`
**Method:** POST
**Description:** Processes a CSV file with multiple patients

**Request:**
- Form data with a `file` field containing a CSV file

**Response:**
\`\`\`json
{
  "fileName": "patients.csv",
  "totalPatients": 25,
  "processedAt": "2023-06-15T12:34:56.789Z",
  "summary": {
    "averageSurvivalMonths": 28.6,
    "highRiskPatients": 8,
    "mediumRiskPatients": 12,
    "lowRiskPatients": 5
  },
  "modelPerformance": {
    "cox": {"cIndex": 0.68},
    "rsf": {"cIndex": 0.72},
    "deepsurv": {"cIndex": 0.75}
  },
  "topFeatures": [
    {
      "feature": "Tumor Stage",
      "importance": 0.28
    },
    ...
  ],
  "patients": [
    {
      "patientId": "PATIENT-001",
      "survivalProbability": 0.78,
      "riskScore": 0.32,
      "predictedSurvivalMonths": 36.5
    },
    ...
  ]
}
\`\`\`

## Models

The backend implements three survival analysis models:

1. **Cox Proportional Hazards Model**
   - Semi-parametric regression model
   - Time Complexity: O(n²)
   - High interpretability

2. **Random Survival Forest**
   - Ensemble-based method
   - Time Complexity: O(nt log t)
   - Handles non-linear relationships

3. **DeepSurv**
   - Deep learning implementation of Cox model
   - Time Complexity: O(ep·d·n)
   - Captures complex patterns

## Directory Structure

\`\`\`
backend/
├── app.py                     # Main Flask application
├── models/
│   ├── cox_model.py           # Cox Proportional Hazards
│   ├── rsf_model.py           # Random Survival Forest
│   └── deepsurv_model.py      # DeepSurv implementation
├── utils/
│   ├── data_preprocessing.py  # Data cleaning and preprocessing
│   ├── feature_selection.py   # LASSO, PCA implementations
│   ├── metrics.py             # C-index, Brier score, Log-rank
│   ├── shap_explainer.py      # SHAP integration
│   └── file_processor.py      # CSV processing utilities
├── data/
│   ├── sample_data/
│   │   ├── tcga_sample.csv
│   │   └── metabric_sample.csv
│   └── trained_models/
│       ├── cox_model.pkl
│       ├── rsf_model.pkl
│       ├── deepsurv_model.h5
│       └── preprocessor.pkl
└── requirements.txt
