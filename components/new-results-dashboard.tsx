"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  ArrowLeft,
  Download,
  Share,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  PieChartIcon,
  FileText,
  CheckCircle,
} from "lucide-react"
import { SurvivalCurve } from "@/components/survival-curve"
import { FeatureImportance } from "@/components/feature-importance"
import { RiskAssessment } from "@/components/risk-assessment"

interface NewResultsDashboardProps {
  results: any
  onReset: () => void
}

export function NewResultsDashboard({ results, onReset }: NewResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const isMultiplePatients = results.type === "batch" || results.totalPatients > 1

  // If single patient, use the original layout
  if (!isMultiplePatients) {
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
              <p className="text-xs text-gray-600 mt-1">
                C-index: {results.modelComparison.deepsurv.cIndex.toFixed(3)}
              </p>
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
                        {data.prediction && (
                          <p className="text-xs text-gray-600">{data.prediction.toFixed(1)} months</p>
                        )}
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

  // NEW BATCH ANALYSIS LAYOUT ONLY
  const COLORS = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
  }

  const exportResults = () => {
    const csvContent = [
      "Patient ID,Age,Gender,Tumor Stage,Survival Probability,Risk Score,Predicted Survival (Months),Risk Category",
      ...results.patients.map(
        (p) =>
          `${p.patientId},${p.age},${p.gender},${p.tumorStage},${p.survivalProbability},${p.riskScore},${p.predictedSurvivalMonths},${p.riskCategory}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `survival_analysis_results_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const riskData = [
    { name: "Low Risk", value: results.demographics.riskDistribution.low, color: COLORS.low },
    { name: "Medium Risk", value: results.demographics.riskDistribution.medium, color: COLORS.medium },
    { name: "High Risk", value: results.demographics.riskDistribution.high, color: COLORS.high },
  ]

  const ageData = Object.entries(results.demographics.ageDistribution).map(([age, count]) => ({
    age,
    count,
  }))

  const stageData = Object.entries(results.demographics.stageDistribution).map(([stage, count]) => ({
    stage,
    count,
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cohort Analysis Results
          </h2>
          <p className="text-gray-600 mt-1">
            Analysis of {results.totalPatients} patients from {results.fileName}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Patients</p>
                <p className="text-2xl font-bold text-blue-900">{results.totalPatients}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Avg Survival</p>
                <p className="text-2xl font-bold text-green-900">{results.summary.averageSurvivalMonths.toFixed(1)}m</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">High Risk</p>
                <p className="text-2xl font-bold text-red-900">{results.summary.highRiskPatients}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Best Model</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Object.entries(results.modelPerformance)
                    .reduce((a, b) => (a[1].cIndex > b[1].cIndex ? a : b))[0]
                    .toUpperCase()}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="patients">Patient Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk vs Survival Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={results.patients.slice(0, 50)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="riskScore" name="Risk Score" />
                    <YAxis dataKey="predictedSurvivalMonths" name="Survival (months)" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="predictedSurvivalMonths" fill={COLORS.primary} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tumor Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>C-Index scores for different survival models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(results.modelPerformance).map(([model, performance]: [string, any]) => (
                  <Card key={model} className="text-center">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg capitalize mb-2">{model}</h3>
                      <p className="text-3xl font-bold text-blue-600">{performance.cIndex.toFixed(3)}</p>
                      <p className="text-sm text-gray-600">C-Index Score</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Patient Results</span>
                <Badge variant="secondary">{results.totalPatients} patients</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Survival Prob.</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Predicted Survival</TableHead>
                      <TableHead>Risk Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.patients.slice(0, 20).map((patient: any) => (
                      <TableRow key={patient.patientId}>
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{Math.round(patient.age)}</TableCell>
                        <TableCell className="capitalize">{patient.gender}</TableCell>
                        <TableCell>{patient.tumorStage}</TableCell>
                        <TableCell>{(patient.survivalProbability * 100).toFixed(1)}%</TableCell>
                        <TableCell>{(patient.riskScore * 100).toFixed(1)}%</TableCell>
                        <TableCell>{patient.predictedSurvivalMonths.toFixed(1)}m</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.riskCategory === "low"
                                ? "default"
                                : patient.riskCategory === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {patient.riskCategory}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {results.patients.length > 20 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Showing first 20 of {results.patients.length} patients. Export CSV for complete data.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
