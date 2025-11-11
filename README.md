# Cancer Survival Prediction - Advanced ML Analysis Platform

A sophisticated web application for predicting cancer patient survival outcomes using integrated clinical and multi-omics data. Built with Next.js, TypeScript, and advanced machine learning algorithms including Cox Proportional Hazards, Random Survival Forests, DeepSurv, and Kaplan-Meier estimators.

**Project:** RV College of Engineering - Department of Information Science & Engineering (AY 2024-25)  
**Team:** Kushagra Bashisth (1RV23IS064), Mohammad Oweis (1RV23IS072)

---

## Features

- **Multiple ML Models**: Cox PH, Random Survival Forest, DeepSurv, Kaplan-Meier
- **Multi-Omics Support**: Integration of clinical features, gene expression, DNA methylation, and miRNA data
- **Interactive Visualizations**: Survival curves, feature importance charts, risk assessments
- **SHAP Explanations**: Model-agnostic interpretability for predictions
- **Model Comparison**: Side-by-side analysis of different algorithms
- **File Upload**: Support for CSV/Excel data uploads
- **Responsive Design**: Mobile-friendly interface with shadcn/ui components
- **Real-time Processing**: Fast predictions with efficient algorithms

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend (Optional)
- **Python 3.9+** - ML model implementation
- **Flask** - REST API framework
- **NumPy/Pandas** - Data manipulation
- **scikit-learn** - ML algorithms
- **TensorFlow/Keras** - Deep learning (DeepSurv)
- **lifelines** - Survival analysis library

---

## Prerequisites

### Required
- Node.js 18+ and npm/yarn
- Git

### Optional (for backend ML models)
- Python 3.9+
- pip package manager

---

## Quick Start

### 1. Download & Extract Project

\`\`\`bash
# Download the ZIP file from v0.app
# Extract to your desired location
cd cancer-survival-project
\`\`\`

### 2. Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
# Backend API URL (optional)
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Optional: Analytics and other services
# NEXT_PUBLIC_API_KEY=your_key_here
\`\`\`

### 4. Run the Frontend

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

---

## Running with Python Backend (Optional)

To use real ML models instead of mock predictions:

### 1. Install Python Dependencies

\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

### 2. Run the Flask Backend

\`\`\`bash
python app.py
\`\`\`

The backend API will be available at `http://localhost:5000`

### 3. Dual Terminal Setup

**Terminal 1 - Frontend:**
\`\`\`bash
npm run dev
\`\`\`

**Terminal 2 - Backend:**
\`\`\`bash
cd backend
python app.py
\`\`\`

Both services must run simultaneously for full functionality.

---

## Project Structure

\`\`\`
cancer-survival-project/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── predict/
│   │   └── page.tsx            # Prediction interface
│   ├── models/
│   │   └── page.tsx            # Model information & comparison
│   ├── about/
│   │   └── page.tsx            # Methodology & about page
│   ├── demo/
│   │   └── page.tsx            # Demo with sample data
│   └── api/
│       ├── predict/route.ts    # Prediction API endpoint
│       └── upload/route.ts     # File upload endpoint
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── results-dashboard.tsx   # Results display
│   ├── survival-curve.tsx      # Survival visualization
│   ├── feature-importance.tsx  # Feature analysis
│   ├── risk-assessment.tsx     # Risk scoring
│   └── file-upload.tsx         # File upload component
│
├── backend/
│   ├── app.py                  # Flask application
│   ├── models/
│   │   ├── cox_model.py        # Cox PH implementation
│   │   ├── rsf_model.py        # Random Survival Forest
│   │   ├── deepsurv_model.py   # DeepSurv neural network
│   │   └── kaplan_meier.py     # Kaplan-Meier estimator
│   ├── utils/
│   │   ├── preprocessing.py    # Data preprocessing
│   │   ├── metrics.py          # Evaluation metrics
│   │   └── shap_explain.py     # SHAP explanations
│   └── requirements.txt        # Python dependencies
│
├── lib/
│   └── utils.ts                # Utility functions
│
├── public/
│   └── favicon.ico             # Site favicon
│
├── package.json                # npm dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.mjs             # Next.js configuration
└── README.md                   # This file
\`\`\`

---

## Machine Learning Models

### 1. Cox Proportional Hazards
- **Complexity**: O(n²)
- **Interpretability**: High
- **Use Case**: Baseline semi-parametric survival analysis
- **Handles**: Censored data, proportional hazards assumption

### 2. Random Survival Forest
- **Complexity**: O(nt log t)
- **Interpretability**: Medium
- **Use Case**: Non-linear relationships, variable interactions
- **Advantages**: Robust to outliers, handles high-dimensional data

### 3. DeepSurv
- **Complexity**: O(ep·d·n)
- **Interpretability**: Low
- **Use Case**: Complex patterns, large datasets
- **Advantages**: End-to-end learning, captures non-linear patterns

### 4. Kaplan-Meier
- **Complexity**: O(n log n)
- **Interpretability**: High
- **Use Case**: Non-parametric baseline, clinical trial reporting
- **Advantages**: No distributional assumptions, naturally handles censoring

---

## Data Format

### Supported File Types
- CSV (.csv)
- Excel (.xlsx)
- TSV (.tsv)

### Required Columns
- Patient ID
- Survival time (months/days)
- Event indicator (0 = censored, 1 = event)
- Clinical features (age, stage, grade, etc.)
- Optional: Gene expression, methylation, miRNA data

### Example CSV
\`\`\`csv
patient_id,survival_time,event,age,stage,grade,expression_gene1,expression_gene2
P001,36,1,55,3,2,0.45,0.89
P002,48,0,62,2,1,0.32,0.71
P003,24,1,48,4,3,0.67,0.54
\`\`\`

---

## API Endpoints

### POST /api/predict
Predict survival outcomes for patient data

**Request:**
\`\`\`json
{
  "patients": [
    {
      "age": 55,
      "stage": 3,
      "grade": 2,
      "gene_expression": [0.45, 0.89, 0.34]
    }
  ],
  "models": ["cox", "rsf", "deepsurv", "km"]
}
\`\`\`

**Response:**
\`\`\`json
{
  "predictions": [
    {
      "cox": {
        "risk_score": 0.75,
        "survival_probability": [0.95, 0.85, 0.70],
        "median_survival": 24
      },
      "rsf": { ... },
      "deepsurv": { ... },
      "km": { ... }
    }
  ],
  "feature_importance": { ... },
  "shap_values": [ ... ]
}
\`\`\`

### POST /api/upload
Upload patient data file

**Request:** Form data with file
**Response:** Processed data and validation results

---

## Usage Guide

### Making Predictions

1. Navigate to the **Predict** page
2. Choose input method:
   - **Upload CSV/Excel** for batch predictions
   - **Manual entry** for single patients
3. Review the results dashboard:
   - Survival curves from all models
   - Risk assessment scores
   - Feature importance rankings
   - SHAP explanations

### Model Comparison

1. Go to the **Models** page
2. Review algorithm details:
   - Time/space complexity analysis
   - Interpretability assessment
   - Use case recommendations
3. Compare predictions across models

### Exploring Methodology

1. Visit the **About** page for:
   - Algorithm explanations
   - Dataset information (TCGA, METABRIC)
   - Clinical significance
   - References and papers

---

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
\`\`\`

### Python Module Not Found
\`\`\`bash
cd backend
pip install --upgrade -r requirements.txt
\`\`\`

### Backend Connection Error
- Verify backend is running: `http://localhost:5000`
- Check `.env.local` has correct `BACKEND_URL`
- Review browser console for CORS errors

### File Upload Issues
- Ensure CSV has required columns
- Check file size (< 50MB recommended)
- Verify data types match expected format

### Model Predictions Failing
- Frontend uses fallback mock models if backend unavailable
- Check backend logs for ML errors
- Verify input data matches training features

---

## Development

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

### Type Checking
\`\`\`bash
npx tsc --noEmit
\`\`\`

### Backend Development
\`\`\`bash
cd backend
python -m flask --app app run --reload
\`\`\`

---


## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_URL` | No | Backend API URL for development |
| `NEXT_PUBLIC_BACKEND_URL` | No | Backend URL exposed to client |
| `NODE_ENV` | No | Environment (development/production) |

---

## Performance Notes

- **Frontend**: Static generation for pages, ISR for predictions
- **Backend**: Numpy vectorization for 1000+ patient predictions
- **Models**: Pre-trained weights loaded on startup
- **Database**: Optional - use Supabase/Neon for persistent storage

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is developed as an academic project at RV College of Engineering. For research and educational use only.

---

## References

- **Cox Model**: Cox, D. R. (1972). Regression Models and Life-Tables
- **Random Survival Forests**: Ishwaran et al. (2008)
- **DeepSurv**: Faraggi & Simon (1995); Katzman et al. (2018)
- **Kaplan-Meier**: Kaplan & Meier (1958)
- **Datasets**: TCGA Project, METABRIC Consortium




