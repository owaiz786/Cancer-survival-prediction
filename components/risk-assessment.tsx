"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface RiskAssessmentProps {
  results: any
}

export function RiskAssessment({ results }: RiskAssessmentProps) {
  const riskScore = results.riskScore || 0.5
  const survivalProb = results.survivalProbability || 0.7

  const getRiskLevel = (score: number) => {
    if (score < 0.3)
      return {
        level: "Low Risk",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircle,
        description: "Favorable prognosis with good survival outlook",
      }
    if (score < 0.6)
      return {
        level: "Medium Risk",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: Clock,
        description: "Moderate risk requiring regular monitoring",
      }
    return {
      level: "High Risk",
      color: "text-red-600",
      bg: "bg-red-100",
      icon: AlertTriangle,
      description: "Elevated risk requiring immediate attention",
    }
  }

  const risk = getRiskLevel(riskScore)
  const RiskIcon = risk.icon

  // Calculate risk factors
  const riskFactors = [
    {
      factor: "Overall Survival Risk",
      score: riskScore,
      description: "Composite risk based on all available data",
    },
    {
      factor: "Short-term Risk (6 months)",
      score: riskScore * 0.7,
      description: "Immediate survival probability",
    },
    {
      factor: "Long-term Risk (2+ years)",
      score: riskScore * 1.2,
      description: "Extended survival outlook",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RiskIcon className={`w-5 h-5 ${risk.color}`} />
          <span>Risk Assessment</span>
        </CardTitle>
        <CardDescription>Comprehensive risk evaluation based on clinical and molecular data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center p-6 border rounded-lg">
          <div className="text-4xl font-bold text-gray-900 mb-2">{(riskScore * 100).toFixed(0)}</div>
          <Badge className={`${risk.bg} ${risk.color} border-0 mb-2`}>{risk.level}</Badge>
          <p className="text-sm text-gray-600">{risk.description}</p>
        </div>

        {/* Risk Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Risk Breakdown</h4>
          {riskFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{factor.factor}</span>
                <span className="text-sm text-gray-600">{(factor.score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(factor.score * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500">{factor.description}</p>
            </div>
          ))}
        </div>

        {/* Survival Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{(survivalProb * 100).toFixed(0)}%</div>
            <p className="text-xs text-blue-600 font-medium">24-Month Survival</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {results.predictedSurvivalMonths ? results.predictedSurvivalMonths.toFixed(0) : "24"}
            </div>
            <p className="text-xs text-green-600 font-medium">Predicted Months</p>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Clinical Recommendations
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {riskScore < 0.3 ? (
              <>
                <li>• Standard follow-up schedule recommended</li>
                <li>• Continue current treatment protocol</li>
                <li>• Monitor for any changes in condition</li>
              </>
            ) : riskScore < 0.6 ? (
              <>
                <li>• Enhanced monitoring recommended</li>
                <li>• Consider additional imaging studies</li>
                <li>• Evaluate treatment intensification</li>
              </>
            ) : (
              <>
                <li>• Immediate clinical review required</li>
                <li>• Consider aggressive treatment options</li>
                <li>• Frequent monitoring and reassessment</li>
                <li>• Multidisciplinary team consultation</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
