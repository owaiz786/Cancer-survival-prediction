# 🧬 Cancer Survival Prediction - Advanced ML Analysis Platform

A **sophisticated web application** for predicting cancer patient survival outcomes using integrated clinical and multi-omics data.  
Built with **Next.js**, **TypeScript**, and advanced **machine learning algorithms** including Cox Proportional Hazards, Random Survival Forests, DeepSurv, and Kaplan-Meier estimators.

---

## 📘 Project Overview

## ✨ Key Features

- ⚙️ **Multiple ML Models:** Cox PH, Random Survival Forest, DeepSurv, Kaplan-Meier  
- 🧫 **Multi-Omics Integration:** Clinical, gene expression, DNA methylation, miRNA  
- 📊 **Interactive Visualizations:** Survival curves, feature importance, risk assessments  
- 🔍 **SHAP Interpretability:** Model-agnostic explanation for predictions  
- ⚖️ **Model Comparison:** Analyze and compare algorithms side by side  
- 📁 **File Upload:** CSV/Excel uploads with instant validation  
- 📱 **Responsive Design:** Built with Tailwind CSS and shadcn/ui  
- ⚡ **Real-Time Predictions:** Optimized for fast computation  

---

## 🧠 Tech Stack

### 🖥️ Frontend
- **Next.js 14** – React framework with App Router  
- **TypeScript** – Strongly typed, modern JS  
- **Tailwind CSS** – Utility-first styling  
- **shadcn/ui** – Prebuilt UI components  
- **Recharts** – Data visualization library  
- **React Hook Form** + **Zod** – Form handling and validation  

### 🧩 Backend (Optional)
- **Python 3.9+** – Model computation and inference  
- **Flask** – REST API framework  
- **NumPy / Pandas** – Data handling  
- **scikit-learn** – Classical ML models  
- **TensorFlow / Keras** – Deep learning (DeepSurv)  
- **lifelines** – Survival analysis library  

---

## ⚙️ Prerequisites

### Required
- Node.js 18+  
- npm / yarn  
- Git

### Optional (for backend ML)
- Python 3.9+  
- pip package manager  

---

## 🚀 Quick Start

### 1️⃣ Download & Extract

```bash
# Download ZIP from GitHub or Vercel
cd cancer-survival-project

2️⃣ Install Dependencies
npm install

3️⃣ Create .env.local
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
# NEXT_PUBLIC_API_KEY=your_key_here (optional)

4️⃣ Run the Frontend
npm run dev


Visit ➤ http://localhost:3000

🧪 Running with Python Backend (Optional)
Install Python Packages
cd backend
pip install -r requirements.txt

Run Flask API
python app.py

Dual Terminal Setup

Terminal 1 – Frontend

npm run dev


Terminal 2 – Backend

cd backend
python app.py

🧩 Project Structure
cancer-survival-project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── predict/page.tsx
│   ├── models/page.tsx
│   ├── about/page.tsx
│   ├── demo/page.tsx
│   └── api/
│       ├── predict/route.ts
│       └── upload/route.ts
│
├── components/
│   ├── ui/
│   ├── results-dashboard.tsx
│   ├── survival-curve.tsx
│   ├── feature-importance.tsx
│   ├── risk-assessment.tsx
│   └── file-upload.tsx
│
├── backend/
│   ├── app.py
│   ├── models/
│   │   ├── cox_model.py
│   │   ├── rsf_model.py
│   │   ├── deepsurv_model.py
│   │   └── kaplan_meier.py
│   ├── utils/
│   │   ├── preprocessing.py
│   │   ├── metrics.py
│   │   └── shap_explain.py
│   └── requirements.txt
│
├── lib/utils.ts
├── public/favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md

🧮 Machine Learning Models
Model	Complexity	Interpretability	Use Case	Key Advantage
Cox Proportional Hazards	O(n²)	🔹 High	Baseline semi-parametric	Handles censoring
Random Survival Forest	O(nt log t)	🔸 Medium	Non-linear relationships	Robust, high-dimensional data
DeepSurv	O(ep·d·n)	🔸 Low	Deep learning	Captures non-linear survival patterns
Kaplan-Meier	O(n log n)	🔹 High	Non-parametric estimation	Simple, handles censoring
🧾 Data Format
Supported File Types

CSV, Excel (.xlsx), TSV

Required Columns

patient_id

survival_time

event (0 = censored, 1 = event)

Clinical features (age, stage, grade, etc.)

Optional omics data (gene expression, methylation, miRNA)

Example CSV
patient_id,survival_time,event,age,stage,grade,expression_gene1,expression_gene2
P001,36,1,55,3,2,0.45,0.89
P002,48,0,62,2,1,0.32,0.71
P003,24,1,48,4,3,0.67,0.54

🔌 API Endpoints
POST /api/predict

Predict survival outcomes.

Request:

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


Response:

{
  "predictions": [
    {
      "cox": {
        "risk_score": 0.75,
        "survival_probability": [0.95, 0.85, 0.70],
        "median_survival": 24
      }
    }
  ],
  "feature_importance": {},
  "shap_values": []
}

POST /api/upload

Upload patient data file.
Response: Validated and parsed data summary.

🧭 Usage Guide
🔹 Prediction Workflow

Go to Predict page

Upload CSV/Excel or manually enter data

View results:

Survival curves

Risk assessments

Feature importances

SHAP explanations

🔹 Model Comparison

Visit the Models page to compare algorithm performance, interpretability, and use cases.

🔹 Methodology

Explore About page for:

Algorithm explanations

Dataset references (TCGA, METABRIC)

Clinical implications

🛠️ Troubleshooting
Issue	Solution
Port in Use	npx kill-port 3000 or npm run dev -- -p 3001
Missing Python Module	pip install --upgrade -r requirements.txt
Backend Connection Error	Check .env.local and backend status
File Upload Error	Verify CSV format and size (< 50MB)
Model Prediction Fails	Use mock data fallback or inspect backend logs
⚡ Development Commands
Task	Command
Build for production	npm run build && npm start
Lint code	npm run lint
Type check	npx tsc --noEmit
Run backend	python -m flask --app app run --reload

📚 References

Cox Model: D.R. Cox (1972), Regression Models and Life-Tables

Random Survival Forests: Ishwaran et al. (2008)

DeepSurv: Faraggi & Simon (1995), Katzman et al. (2018)

Kaplan-Meier: Kaplan & Meier (1958)

Datasets: TCGA, METABRIC
