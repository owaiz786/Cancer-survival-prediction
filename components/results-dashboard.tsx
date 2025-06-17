"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Share, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { SurvivalCurve } from "@/components/survival-curve"
import { FeatureImportance } from "@/components/feature-importance"
import { RiskAssessment } from "@/components/risk-assessment"
import { BatchResultsDashboard } from "@/components/batch-results-dashboard"

interface ResultsDashboardProps {
  results: any
  onReset: () => void
}

export function ResultsDashboard({ results, onReset }: ResultsDashboardProps) {
  // Check if this is a batch analysis result
  if (results.fileName && results.totalPatients > 1) {
    return <BatchResultsDashboard results={results} onReset={onReset} />
  }

  // Single patient analysis (existing code)
  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { level: "Low", color: "text-green-600", bg: "bg-green-100" }
    if (score < 0.6) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "High", color: "text-red-600", bg: "bg-red-100" }
  }

  const risk = getRiskLevel(results.riskScore)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prediction Results</h1>
            <p className="text-sm text-gray-600">Patient ID: {results.patientId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Survival Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(results.survivalProbability * 100).toFixed(1)}%</div>
            <p className="text-xs text-gray-600 mt-1">24-month survival</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-900">{results.riskScore.toFixed(2)}</div>
              <Badge className={`${risk.bg} ${risk.color} border-0`}>{risk.level}</Badge>
            </div>
            <Progress value={results.riskScore * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Predicted Survival</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{results.predictedSurvivalMonths.toFixed(1)}</div>
            <p className="text-xs text-gray-600 mt-1">months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Best Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">DeepSurv</div>
            <p className="text-xs text-gray-600 mt-1">C-index: {results.modelComparison.deepsurv.cIndex.toFixed(3)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Model Comparison</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          <TabsTrigger value="survival">Survival Curves</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <RiskAssessment results={results} />

            <Card>
              <CardHeader>
                <CardTitle>Clinical Insights</CardTitle>
                <CardDescription>Key findings and recommendations based on the analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Survival Prediction</p>
                    <p className="text-sm text-gray-600">
                      Patient shows {results.survivalProbability > 0.7 ? "favorable" : "concerning"} survival
                      probability
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Risk Factors</p>
                    <p className="text-sm text-gray-600">
                      {results.featureImportance[0].feature} is the most significant predictor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Recommendations</p>
                    <p className="text-sm text-gray-600">
                      Consider {risk.level.toLowerCase()} risk monitoring protocol
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>Comparison of different survival analysis algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.modelComparison).map(([model, data]: [string, any]) => (
                  <div key={model} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold capitalize">
                        {model === "cox"
                          ? "Cox Proportional Hazards"
                          : model === "rsf"
                            ? "Random Survival Forest"
                            : model === "deepsurv"
                              ? "DeepSurv"
                              : model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {model === "cox"
                          ? "Semi-parametric regression model"
                          : model === "rsf"
                            ? "Ensemble-based survival analysis"
                            : model === "deepsurv"
                              ? "Deep learning Cox model"
                              : "Statistical model"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{data.cIndex.toFixed(3)}</div>
                      <p className="text-xs text-gray-600">C-index</p>
                      {data.prediction && <p className="text-xs text-gray-600">{data.prediction.toFixed(1)} months</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <FeatureImportance features={results.featureImportance} />
        </TabsContent>

        <TabsContent value="survival" className="space-y-6">
          <SurvivalCurve results={results} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
