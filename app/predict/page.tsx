"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, User, FileText } from "lucide-react"
import Link from "next/link"
import { InputForm } from "@/components/input-form"
import { FileUpload } from "@/components/file-upload"
import { ResultsDashboard } from "@/components/results-dashboard"

export default function PredictPage() {
  const [predictionResults, setPredictionResults] = useState(null)
  const [activeTab, setActiveTab] = useState("manual")

  const handlePredictionComplete = (results: any) => {
    setPredictionResults(results)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
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
                <h1 className="text-2xl font-bold text-gray-900">Survival Prediction</h1>
                <p className="text-sm text-gray-600">Clinical & Multi-Omics Data Analysis</p>
              </div>
            </div>
            <Badge variant="secondary">Beta Version</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!predictionResults ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cancer Survival Prediction</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose your input method to analyze patient data using our advanced survival analysis algorithms. You
                can manually enter patient information or upload a CSV file with multiple patients.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="manual" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Manual Input</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>File Upload</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Patient Information</span>
                    </CardTitle>
                    <CardDescription>
                      Enter clinical and molecular data for a single patient. All fields are optional, but more complete
                      data provides better predictions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InputForm onPredictionComplete={handlePredictionComplete} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Batch Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      Upload a CSV file containing multiple patients' data for batch analysis. Download our template to
                      see the required format.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onPredictionComplete={handlePredictionComplete} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Sample Data Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Sample Datasets</CardTitle>
                <CardDescription>
                  Try our pre-loaded sample datasets to explore the platform capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 text-left"
                    onClick={() => {
                      // Simulate loading TCGA sample data
                      const sampleResults = {
                        patientId: "TCGA-SAMPLE-001",
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
                      <h3 className="font-semibold">TCGA Sample Data</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Breast cancer patient with complete clinical and genomic data
                      </p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 text-left"
                    onClick={() => {
                      // Simulate loading METABRIC sample data
                      const sampleResults = {
                        patientId: "METABRIC-SAMPLE-001",
                        survivalProbability: 0.61,
                        riskScore: 0.58,
                        predictedSurvivalMonths: 18.3,
                        modelComparison: {
                          cox: { cIndex: 0.64, prediction: 16.8 },
                          rsf: { cIndex: 0.69, prediction: 18.3 },
                          deepsurv: { cIndex: 0.71, prediction: 19.7 },
                        },
                        featureImportance: [
                          { feature: "Tumor Size", importance: 0.28 },
                          { feature: "Lymph Node Status", importance: 0.25 },
                          { feature: "ER Status", importance: 0.19 },
                          { feature: "Age at Diagnosis", importance: 0.16 },
                          { feature: "Histological Grade", importance: 0.12 },
                        ],
                      }
                      handlePredictionComplete(sampleResults)
                    }}
                  >
                    <div>
                      <h3 className="font-semibold">METABRIC Sample Data</h3>
                      <p className="text-sm text-gray-600 mt-1">Clinical data with molecular subtyping information</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <ResultsDashboard results={predictionResults} onReset={() => setPredictionResults(null)} />
        )}
      </div>
    </div>
  )
}
