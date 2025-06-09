"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import { ResultsDashboard } from "@/components/results-dashboard"

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<string | null>(null)
  const [demoResults, setDemoResults] = useState<any>(null)

  const demoScenarios = [
    {
      id: "breast_cancer_early",
      title: "Early Stage Breast Cancer",
      description: "55-year-old female with Stage I breast cancer, ER+/PR+/HER2-",
      patientProfile: {
        age: 55,
        gender: "Female",
        tumorStage: "Stage I",
        tumorSize: "1.8 cm",
        lymphNodes: "0 positive",
        erStatus: "Positive",
        prStatus: "Positive",
        her2Status: "Negative",
      },
      expectedOutcome: "Favorable prognosis with high survival probability",
      results: {
        patientId: "DEMO-BREAST-001",
        survivalProbability: 0.89,
        riskScore: 0.25,
        predictedSurvivalMonths: 48.2,
        modelComparison: {
          cox: { cIndex: 0.72, prediction: 45.8 },
          rsf: { cIndex: 0.76, prediction: 48.2 },
          deepsurv: { cIndex: 0.79, prediction: 50.1 },
        },
        featureImportance: [
          { feature: "ER Status", importance: 0.28 },
          { feature: "Tumor Stage", importance: 0.24 },
          { feature: "Age at Diagnosis", importance: 0.19 },
          { feature: "Tumor Size", importance: 0.16 },
          { feature: "Lymph Node Status", importance: 0.13 },
        ],
      },
    },
    {
      id: "lung_cancer_advanced",
      title: "Advanced Lung Cancer",
      description: "68-year-old male with Stage III lung adenocarcinoma, high mutation burden",
      patientProfile: {
        age: 68,
        gender: "Male",
        tumorStage: "Stage III",
        tumorSize: "4.2 cm",
        lymphNodes: "3 positive",
        smokingHistory: "Former smoker",
        mutationStatus: "EGFR wild-type",
      },
      expectedOutcome: "Challenging prognosis requiring aggressive treatment",
      results: {
        patientId: "DEMO-LUNG-001",
        survivalProbability: 0.42,
        riskScore: 0.73,
        predictedSurvivalMonths: 16.8,
        modelComparison: {
          cox: { cIndex: 0.68, prediction: 14.2 },
          rsf: { cIndex: 0.71, prediction: 16.8 },
          deepsurv: { cIndex: 0.74, prediction: 18.5 },
        },
        featureImportance: [
          { feature: "Tumor Stage", importance: 0.32 },
          { feature: "Age at Diagnosis", importance: 0.26 },
          { feature: "Lymph Node Status", importance: 0.21 },
          { feature: "Smoking History", importance: 0.12 },
          { feature: "Mutation Status", importance: 0.09 },
        ],
      },
    },
    {
      id: "colorectal_moderate",
      title: "Moderate Risk Colorectal Cancer",
      description: "62-year-old patient with Stage II colorectal cancer, MSI-stable",
      patientProfile: {
        age: 62,
        gender: "Male",
        tumorStage: "Stage II",
        tumorSize: "3.1 cm",
        lymphNodes: "0 positive",
        msiStatus: "MSI-stable",
        location: "Sigmoid colon",
      },
      expectedOutcome: "Moderate risk with good response to standard treatment",
      results: {
        patientId: "DEMO-COLORECTAL-001",
        survivalProbability: 0.67,
        riskScore: 0.48,
        predictedSurvivalMonths: 32.4,
        modelComparison: {
          cox: { cIndex: 0.65, prediction: 29.7 },
          rsf: { cIndex: 0.69, prediction: 32.4 },
          deepsurv: { cIndex: 0.72, prediction: 34.8 },
        },
        featureImportance: [
          { feature: "Tumor Stage", importance: 0.29 },
          { feature: "MSI Status", importance: 0.23 },
          { feature: "Age at Diagnosis", importance: 0.2 },
          { feature: "Tumor Location", importance: 0.15 },
          { feature: "Tumor Size", importance: 0.13 },
        ],
      },
    },
  ]

  const runDemo = (scenario: any) => {
    setCurrentDemo(scenario.id)
    setDemoResults(scenario.results)
  }

  const resetDemo = () => {
    setCurrentDemo(null)
    setDemoResults(null)
  }

  if (demoResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={resetDemo}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Demos
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Demo Results</h1>
                  <p className="text-sm text-gray-600">Interactive demonstration</p>
                </div>
              </div>
              <Badge variant="secondary">Demo Mode</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <ResultsDashboard results={demoResults} onReset={resetDemo} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interactive Demo</h1>
              <p className="text-sm text-gray-600">Explore cancer survival prediction with sample cases</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Our Survival Prediction Models</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore how our advanced algorithms analyze different cancer scenarios. Each demo showcases real-world
              patient profiles and demonstrates the predictive capabilities of our integrated clinical and multi-omics
              approach.
            </p>
          </div>

          {/* Demo Scenarios */}
          <div className="grid lg:grid-cols-3 gap-6">
            {demoScenarios.map((scenario) => (
              <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Patient Profile */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Patient Profile</h4>
                    <div className="space-y-1">
                      {Object.entries(scenario.patientProfile).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Outcome */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-xs text-blue-900 mb-1">Expected Outcome</h4>
                    <p className="text-xs text-blue-700">{scenario.expectedOutcome}</p>
                  </div>

                  {/* Run Demo Button */}
                  <Button onClick={() => runDemo(scenario)} className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Run Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Highlight */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>What You'll See in the Demo</CardTitle>
              <CardDescription>
                Each demo showcases the full capabilities of our survival prediction platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Survival Curves</h4>
                  <p className="text-xs text-gray-600">Interactive survival probability plots over time</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Risk Assessment</h4>
                  <p className="text-xs text-gray-600">Comprehensive risk scoring and categorization</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🔍</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Feature Analysis</h4>
                  <p className="text-xs text-gray-600">SHAP explanations and feature importance</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Model Comparison</h4>
                  <p className="text-xs text-gray-600">Performance across different algorithms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Analyze Your Own Data?</h3>
            <p className="text-gray-600 mb-6">
              Upload your clinical and multi-omics data for personalized survival analysis
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/predict">Start Real Analysis</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
