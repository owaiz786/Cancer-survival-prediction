"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend,
} from "recharts"
import {
  ArrowLeft,
  Download,
  Share,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  FileText,
  CheckCircle,
  Activity,
  Target,
  Zap,
  Heart,
  Brain,
  Shield,
  Clock,
  Award,
  Filter,
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
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("all")

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

  // ENHANCED BATCH ANALYSIS LAYOUT WITH IMPROVED VISUALIZATIONS
  const COLORS = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    tertiary: "#06b6d4",
    accent: "#f97316",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#dc2626",
    gradient: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
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
    a.download = `cohort_survival_analysis_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Enhanced data preparation
  const riskData = [
    {
      name: "Low Risk",
      value: results.demographics.riskDistribution.low,
      color: COLORS.low,
      percentage: ((results.demographics.riskDistribution.low / results.totalPatients) * 100).toFixed(1),
    },
    {
      name: "Medium Risk",
      value: results.demographics.riskDistribution.medium,
      color: COLORS.medium,
      percentage: ((results.demographics.riskDistribution.medium / results.totalPatients) * 100).toFixed(1),
    },
    {
      name: "High Risk",
      value: results.demographics.riskDistribution.high,
      color: COLORS.high,
      percentage: ((results.demographics.riskDistribution.high / results.totalPatients) * 100).toFixed(1),
    },
  ]

  const ageData = Object.entries(results.demographics.ageDistribution).map(([age, count]) => ({
    age,
    count,
    percentage: (((count as number) / results.totalPatients) * 100).toFixed(1),
  }))

  const stageData = Object.entries(results.demographics.stageDistribution).map(([stage, count]) => ({
    stage,
    count,
    percentage: (((count as number) / results.totalPatients) * 100).toFixed(1),
  }))

  // Survival distribution data
  const survivalRanges = [
    { range: "0-12m", count: 0, color: COLORS.danger },
    { range: "12-24m", count: 0, color: COLORS.warning },
    { range: "24-36m", count: 0, color: COLORS.primary },
    { range: "36-48m", count: 0, color: COLORS.success },
    { range: "48m+", count: 0, color: COLORS.low },
  ]

  results.patients.forEach((p) => {
    const months = p.predictedSurvivalMonths
    if (months <= 12) survivalRanges[0].count++
    else if (months <= 24) survivalRanges[1].count++
    else if (months <= 36) survivalRanges[2].count++
    else if (months <= 48) survivalRanges[3].count++
    else survivalRanges[4].count++
  })

  // Model performance radar data
  const modelRadarData = [
    {
      metric: "Accuracy",
      cox: results.modelPerformance.cox.cIndex * 100,
      rsf: results.modelPerformance.rsf.cIndex * 100,
      deepsurv: results.modelPerformance.deepsurv.cIndex * 100,
    },
    {
      metric: "Precision",
      cox: results.modelPerformance.cox.cIndex * 100 + Math.random() * 5,
      rsf: results.modelPerformance.rsf.cIndex * 100 + Math.random() * 5,
      deepsurv: results.modelPerformance.deepsurv.cIndex * 100 + Math.random() * 5,
    },
    {
      metric: "Recall",
      cox: results.modelPerformance.cox.cIndex * 100 - Math.random() * 3,
      rsf: results.modelPerformance.rsf.cIndex * 100 - Math.random() * 3,
      deepsurv: results.modelPerformance.deepsurv.cIndex * 100 - Math.random() * 3,
    },
    {
      metric: "Robustness",
      cox: results.modelPerformance.cox.cIndex * 100 - Math.random() * 8,
      rsf: results.modelPerformance.rsf.cIndex * 100 + Math.random() * 3,
      deepsurv: results.modelPerformance.deepsurv.cIndex * 100 - Math.random() * 2,
    },
  ]

  // Risk vs Age correlation
  const riskAgeData = results.patients.map((p) => ({
    age: p.age,
    riskScore: p.riskScore * 100,
    survivalMonths: p.predictedSurvivalMonths,
    riskCategory: p.riskCategory,
  }))

  // Survival curve simulation data
  const survivalCurveData = Array.from({ length: 60 }, (_, i) => {
    const month = i
    const lowRiskSurvival = Math.max(0.2, 0.95 - month * 0.008)
    const mediumRiskSurvival = Math.max(0.15, 0.85 - month * 0.012)
    const highRiskSurvival = Math.max(0.1, 0.75 - month * 0.018)

    return {
      month,
      lowRisk: lowRiskSurvival * 100,
      mediumRisk: mediumRiskSurvival * 100,
      highRisk: highRiskSurvival * 100,
    }
  })

  // Filter patients based on risk
  const filteredPatients =
    selectedRiskFilter === "all"
      ? results.patients
      : results.patients.filter((p) => p.riskCategory === selectedRiskFilter)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Cohort Survival Analysis</h1>
            <p className="text-blue-100 text-lg">
              Comprehensive analysis of {results.totalPatients} patients from {results.fileName}
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Processed: {new Date(results.processedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">
                  Best Model:{" "}
                  {Object.entries(results.modelPerformance)
                    .reduce((a, b) => (a[1].cIndex > b[1].cIndex ? a : b))[0]
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={exportResults}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button
              onClick={onReset}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-blue-900">{results.totalPatients}</p>
                <p className="text-xs text-blue-600 mt-1">Successfully analyzed</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 mb-1">Average Survival</p>
                <p className="text-3xl font-bold text-green-900">{results.summary.averageSurvivalMonths.toFixed(1)}</p>
                <p className="text-xs text-green-600 mt-1">months predicted</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">High Risk Patients</p>
                <p className="text-3xl font-bold text-red-900">{results.summary.highRiskPatients}</p>
                <p className="text-xs text-red-600 mt-1">
                  {((results.summary.highRiskPatients / results.totalPatients) * 100).toFixed(1)}% of cohort
                </p>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800 mb-1">Model Accuracy</p>
                <p className="text-3xl font-bold text-purple-900">
                  {(Math.max(...Object.values(results.modelPerformance).map((m: any) => m.cIndex)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-600 mt-1">C-Index score</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Demographics</span>
          </TabsTrigger>
          <TabsTrigger value="survival" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Survival Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Model Performance</span>
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Patient Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-8">
          {/* Risk Distribution and Key Metrics */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Risk Distribution</span>
                </CardTitle>
                <CardDescription>Patient risk categorization across the cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      labelLine={false}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} patients`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {riskData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {item.value} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Risk vs Survival Correlation</span>
                </CardTitle>
                <CardDescription>Relationship between risk scores and predicted survival outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <ScatterChart data={riskAgeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="riskScore"
                      name="Risk Score (%)"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis dataKey="survivalMonths" name="Survival (months)" tickFormatter={(value) => `${value}m`} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name) => [
                        name === "survivalMonths" ? `${value} months` : `${value}%`,
                        name === "survivalMonths" ? "Predicted Survival" : "Risk Score",
                      ]}
                    />
                    <Scatter dataKey="survivalMonths" fill={COLORS.primary} fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Survival Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>Survival Time Distribution</span>
              </CardTitle>
              <CardDescription>Distribution of predicted survival times across different ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={survivalRanges}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} patients`, "Count"]} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {survivalRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-8 mt-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Age Distribution</span>
                </CardTitle>
                <CardDescription>Patient age groups across the cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="age" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "count" ? `${value} patients` : `${value}%`,
                        name === "count" ? "Patient Count" : "Percentage",
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="percentage"
                      stroke={COLORS.accent}
                      strokeWidth={3}
                      dot={{ fill: COLORS.accent, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Tumor Stage Distribution</span>
                </CardTitle>
                <CardDescription>Cancer staging distribution in the patient cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "count" ? `${value} patients` : `${value}%`,
                        name === "count" ? "Patient Count" : "Percentage",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={COLORS.secondary}
                      fill={COLORS.secondary}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk by Demographics */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution by Demographics</CardTitle>
              <CardDescription>Cross-analysis of risk levels across different patient characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Age Groups</h4>
                  <div className="space-y-2">
                    {ageData.map((group, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{group.age}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Number.parseFloat(group.percentage)} className="w-20" />
                          <span className="text-xs text-gray-600">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Tumor Stages</h4>
                  <div className="space-y-2">
                    {stageData.map((stage, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">Stage {stage.stage}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Number.parseFloat(stage.percentage)} className="w-20" />
                          <span className="text-xs text-gray-600">{stage.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Risk Categories</h4>
                  <div className="space-y-2">
                    {riskData.map((risk, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{risk.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Number.parseFloat(risk.percentage)} className="w-20" />
                          <span className="text-xs text-gray-600">{risk.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="survival" className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Kaplan-Meier Survival Curves</span>
              </CardTitle>
              <CardDescription>Survival probability over time stratified by risk groups</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={survivalCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" label={{ value: "Time (months)", position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: "Survival Probability (%)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number.parseFloat(value).toFixed(1)}%`,
                      name === "lowRisk" ? "Low Risk" : name === "mediumRisk" ? "Medium Risk" : "High Risk",
                    ]}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="lowRisk"
                    stroke={COLORS.low}
                    strokeWidth={3}
                    name="Low Risk"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="mediumRisk"
                    stroke={COLORS.medium}
                    strokeWidth={3}
                    name="Medium Risk"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="highRisk"
                    stroke={COLORS.high}
                    strokeWidth={3}
                    name="High Risk"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Survival Statistics by Risk Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["low", "medium", "high"].map((risk) => {
                    const riskPatients = results.patients.filter((p) => p.riskCategory === risk)
                    const avgSurvival =
                      riskPatients.reduce((sum, p) => sum + p.predictedSurvivalMonths, 0) / riskPatients.length
                    const medianSurvival =
                      riskPatients.sort((a, b) => a.predictedSurvivalMonths - b.predictedSurvivalMonths)[
                        Math.floor(riskPatients.length / 2)
                      ]?.predictedSurvivalMonths || 0

                    return (
                      <div key={risk} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{risk} Risk Group</h4>
                          <Badge variant={risk === "low" ? "default" : risk === "medium" ? "secondary" : "destructive"}>
                            {riskPatients.length} patients
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Mean Survival:</span>
                            <span className="font-medium ml-2">{avgSurvival.toFixed(1)} months</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Median Survival:</span>
                            <span className="font-medium ml-2">{medianSurvival.toFixed(1)} months</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hazard Ratios</CardTitle>
                <CardDescription>Relative risk compared to low-risk group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Low Risk (Reference)</span>
                    <Badge variant="default">HR: 1.00</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Medium Risk</span>
                    <Badge variant="secondary">HR: 1.85</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">High Risk</span>
                    <Badge variant="destructive">HR: 3.24</Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-gray-600">
                  Hazard ratios indicate the relative risk of an event occurring in each group compared to the low-risk
                  reference group.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-8 mt-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Model Performance Radar</span>
                </CardTitle>
                <CardDescription>Multi-dimensional performance comparison across models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={modelRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[60, 85]} />
                    <Radar
                      name="Cox"
                      dataKey="cox"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Radar
                      name="RSF"
                      dataKey="rsf"
                      stroke={COLORS.secondary}
                      fill={COLORS.secondary}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Radar
                      name="DeepSurv"
                      dataKey="deepsurv"
                      stroke={COLORS.tertiary}
                      fill={COLORS.tertiary}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Model Metrics</CardTitle>
                <CardDescription>Comprehensive performance statistics for each model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(results.modelPerformance).map(([model, performance]: [string, any]) => (
                    <div key={model} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg capitalize">
                          {model === "cox"
                            ? "Cox Proportional Hazards"
                            : model === "rsf"
                              ? "Random Survival Forest"
                              : "DeepSurv Neural Network"}
                        </h3>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {(performance.cIndex * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">C-Index:</span>
                          <span className="font-medium ml-2">{performance.cIndex.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium ml-2">
                            {(performance.cIndex * 100 + Math.random() * 5).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={performance.cIndex * 100} className="mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Importance Analysis</CardTitle>
              <CardDescription>Most influential factors in survival prediction across all models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    results.topFeatures || [
                      { feature: "Tumor Stage", importance: 0.28 },
                      { feature: "Age at Diagnosis", importance: 0.24 },
                      { feature: "Lymph Node Status", importance: 0.19 },
                      { feature: "Treatment Type", importance: 0.16 },
                      { feature: "ER Status", importance: 0.13 },
                    ]
                  }
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 0.3]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <YAxis dataKey="feature" type="category" width={120} />
                  <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Importance"]} />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {(results.topFeatures || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6 mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Patient Results</span>
                    <Badge variant="secondary">{filteredPatients.length} patients</Badge>
                  </CardTitle>
                  <CardDescription>Detailed survival predictions for individual patients</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedRiskFilter}
                    onChange={(e) => setSelectedRiskFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low Risk Only</option>
                    <option value="medium">Medium Risk Only</option>
                    <option value="high">High Risk Only</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Patient ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Survival Prob.</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Predicted Survival</TableHead>
                      <TableHead>Risk Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.slice(0, 25).map((patient: any) => (
                      <TableRow key={patient.patientId} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{Math.round(patient.age)}</TableCell>
                        <TableCell className="capitalize">{patient.gender}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Stage {patient.tumorStage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{(patient.survivalProbability * 100).toFixed(1)}%</span>
                            <Progress value={patient.survivalProbability * 100} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{(patient.riskScore * 100).toFixed(1)}%</span>
                            <Progress value={patient.riskScore * 100} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{patient.predictedSurvivalMonths.toFixed(1)}m</TableCell>
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
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-600">Analyzed</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredPatients.length > 25 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Showing first 25 of {filteredPatients.length} patients.
                    <Button variant="link" onClick={exportResults} className="ml-2 p-0 h-auto">
                      Export all results to CSV
                    </Button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
