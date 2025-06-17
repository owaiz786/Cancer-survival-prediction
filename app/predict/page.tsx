"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, User, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import { InputForm } from "@/components/input-form"
import { NewFileUpload } from "@/components/new-file-upload"
import { NewResultsDashboard } from "@/components/new-results-dashboard"

export default function PredictPage() {
  const [predictionResults, setPredictionResults] = useState(null)
  const [activeTab, setActiveTab] = useState("manual")

  const handlePredictionComplete = (results: any) => {
    setPredictionResults(results)
  }

  const handleReset = () => {
    setPredictionResults(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cancer Survival Analysis
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Clinical Decision Support</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Advanced ML Models
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!predictionResults ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Predict Cancer Survival Outcomes</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Upload patient data or enter information manually to get AI-powered survival predictions using
                state-of-the-art machine learning models including Cox Regression, Random Survival Forest, and DeepSurv.
              </p>
            </div>

            {/* Method Selection */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
                <TabsTrigger value="manual" className="flex items-center space-x-3 text-base">
                  <User className="w-5 h-5" />
                  <span>Single Patient Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center space-x-3 text-base">
                  <Upload className="w-5 h-5" />
                  <span>Batch File Analysis</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Patient Information Input</span>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Enter clinical and molecular data for individual patient analysis. More complete data provides
                      more accurate predictions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InputForm onPredictionComplete={handlePredictionComplete} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Batch Data Analysis</span>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Upload CSV files containing multiple patient records for comprehensive cohort analysis with
                      advanced visualizations and statistical insights.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NewFileUpload onPredictionComplete={handlePredictionComplete} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Start Section */}
            <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">🚀 Quick Start with Sample Data</CardTitle>
                <CardDescription className="text-green-700">
                  Try our platform instantly with pre-loaded clinical datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-6 text-left border-green-200 hover:border-green-300 hover:bg-green-50"
                    onClick={() => {
                      const sampleResults = {
                        type: "batch",
                        fileName: "TCGA_Breast_Cancer_Sample.csv",
                        totalPatients: 150,
                        processedAt: new Date().toISOString(),
                        summary: {
                          averageSurvivalMonths: 28.4,
                          averageRiskScore: 0.52,
                          highRiskPatients: 45,
                          mediumRiskPatients: 67,
                          lowRiskPatients: 38,
                        },
                        demographics: {
                          ageDistribution: { "18-40": 12, "41-60": 58, "61-80": 67, "80+": 13 },
                          stageDistribution: { I: 23, II: 56, III: 48, IV: 23 },
                          riskDistribution: { low: 38, medium: 67, high: 45 },
                        },
                        modelPerformance: {
                          cox: { cIndex: 0.71 },
                          rsf: { cIndex: 0.76 },
                          deepsurv: { cIndex: 0.79 },
                        },
                        patients: Array.from({ length: 150 }, (_, i) => ({
                          patientId: `TCGA-${String(i + 1).padStart(3, "0")}`,
                          age: 45 + Math.random() * 30,
                          gender: Math.random() > 0.1 ? "female" : "male",
                          tumorStage: ["I", "II", "III", "IV"][Math.floor(Math.random() * 4)],
                          survivalProbability: 0.3 + Math.random() * 0.6,
                          riskScore: 0.2 + Math.random() * 0.6,
                          predictedSurvivalMonths: 12 + Math.random() * 48,
                          riskCategory: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
                        })),
                      }
                      handlePredictionComplete(sampleResults)
                    }}
                  >
                    <div>
                      <h3 className="font-semibold text-green-800">TCGA Breast Cancer</h3>
                      <p className="text-sm text-green-600 mt-1">150 patients with genomic data</p>
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                        Multi-omics
                      </Badge>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-6 text-left border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      const sampleResults = {
                        type: "batch",
                        fileName: "Clinical_Cohort_Sample.csv",
                        totalPatients: 89,
                        processedAt: new Date().toISOString(),
                        summary: {
                          averageSurvivalMonths: 22.1,
                          averageRiskScore: 0.61,
                          highRiskPatients: 32,
                          mediumRiskPatients: 38,
                          lowRiskPatients: 19,
                        },
                        demographics: {
                          ageDistribution: { "18-40": 8, "41-60": 34, "61-80": 39, "80+": 8 },
                          stageDistribution: { I: 12, II: 28, III: 35, IV: 14 },
                          riskDistribution: { low: 19, medium: 38, high: 32 },
                        },
                        modelPerformance: {
                          cox: { cIndex: 0.68 },
                          rsf: { cIndex: 0.73 },
                          deepsurv: { cIndex: 0.71 },
                        },
                        patients: Array.from({ length: 89 }, (_, i) => ({
                          patientId: `CLIN-${String(i + 1).padStart(3, "0")}`,
                          age: 50 + Math.random() * 25,
                          gender: Math.random() > 0.15 ? "female" : "male",
                          tumorStage: ["I", "II", "III", "IV"][Math.floor(Math.random() * 4)],
                          survivalProbability: 0.25 + Math.random() * 0.65,
                          riskScore: 0.3 + Math.random() * 0.5,
                          predictedSurvivalMonths: 8 + Math.random() * 40,
                          riskCategory: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
                        })),
                      }
                      handlePredictionComplete(sampleResults)
                    }}
                  >
                    <div>
                      <h3 className="font-semibold text-blue-800">Clinical Cohort</h3>
                      <p className="text-sm text-blue-600 mt-1">89 patients with clinical data</p>
                      <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                        Clinical
                      </Badge>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-6 text-left border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    onClick={() => {
                      const sampleResults = {
                        type: "single",
                        patientId: "DEMO-PATIENT-001",
                        survivalProbability: 0.73,
                        riskScore: 0.42,
                        predictedSurvivalMonths: 24.5,
                        modelComparison: {
                          cox: { cIndex: 0.68, prediction: 22.1 },
                          rsf: { cIndex: 0.72, prediction: 24.5 },
                          deepsurv: { cIndex: 0.75, prediction: 26.2 },
                        },
                        featureImportance: [
                          { feature: "Age", importance: 0.23 },
                          { feature: "Tumor Stage", importance: 0.31 },
                          { feature: "Gene Expression (TP53)", importance: 0.18 },
                          { feature: "DNA Methylation", importance: 0.15 },
                          { feature: "Treatment History", importance: 0.13 },
                        ],
                      }
                      handlePredictionComplete(sampleResults)
                    }}
                  >
                    <div>
                      <h3 className="font-semibold text-purple-800">Single Patient Demo</h3>
                      <p className="text-sm text-purple-600 mt-1">Individual analysis example</p>
                      <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700">
                        Demo
                      </Badge>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <NewResultsDashboard results={predictionResults} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
