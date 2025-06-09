"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface SurvivalCurveProps {
  results: any
}

export function SurvivalCurve({ results }: SurvivalCurveProps) {
  // Generate mock survival curve data
  const generateSurvivalData = (baseProb: number) => {
    const data = []
    for (let month = 0; month <= 60; month += 3) {
      const survivalProb = baseProb * Math.exp(-0.02 * month) * (1 + 0.1 * Math.sin(month / 10))
      data.push({
        month,
        survival: Math.max(0, Math.min(1, survivalProb)),
        confidence_upper: Math.min(1, survivalProb + 0.1),
        confidence_lower: Math.max(0, survivalProb - 0.1),
      })
    }
    return data
  }

  const patientData = generateSurvivalData(results.survivalProbability || 0.8)

  // Generate comparison data for different risk groups
  const highRiskData = generateSurvivalData(0.6)
  const mediumRiskData = generateSurvivalData(0.75)
  const lowRiskData = generateSurvivalData(0.9)

  const comparisonData = patientData.map((item, index) => ({
    month: item.month,
    patient: item.survival,
    high_risk: highRiskData[index]?.survival || 0,
    medium_risk: mediumRiskData[index]?.survival || 0,
    low_risk: lowRiskData[index]?.survival || 0,
  }))

  // Generate Kaplan-Meier curve data
  const generateKaplanMeierData = (riskScore: number) => {
    const data = []
    let survivalProb = 1.0

    // Event times (months where events occur)
    const eventTimes = [3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60]

    for (let month = 0; month <= 60; month += 3) {
      // Check if this is an event time
      if (eventTimes.includes(month) && month > 0) {
        // Calculate hazard based on risk score
        const hazard = 0.02 + riskScore * 0.05
        const eventProb = hazard * (1 + 0.3 * Math.sin(month / 12))

        // Update survival probability (step function)
        survivalProb *= 1 - Math.min(eventProb, 0.15)
      }

      // Add confidence intervals (±10%)
      const ciWidth = 0.1 * survivalProb

      // Population average (general cancer survival)
      const populationSurvival = 0.85 * Math.exp(-0.015 * month)

      data.push({
        month,
        km_estimate: Math.max(0, survivalProb),
        km_upper: Math.min(1, survivalProb + ciWidth),
        km_lower: Math.max(0, survivalProb - ciWidth),
        population: Math.max(0, populationSurvival),
      })
    }

    return data
  }

  const kaplanMeierData = generateKaplanMeierData(results.riskScore || 0.5)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Survival Curve</CardTitle>
          <CardDescription>Predicted survival probability over time with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Survival Probability", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${(value * 100).toFixed(1)}%`,
                  name === "survival"
                    ? "Survival Probability"
                    : name === "confidence_upper"
                      ? "Upper Confidence"
                      : "Lower Confidence",
                ]}
                labelFormatter={(month) => `Month ${month}`}
              />
              <Area
                type="monotone"
                dataKey="confidence_upper"
                stackId="1"
                stroke="none"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="confidence_lower"
                stackId="1"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
              />
              <Line type="monotone" dataKey="survival" stroke="#3b82f6" strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Group Comparison</CardTitle>
          <CardDescription>Survival curves comparing different risk categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Survival Probability", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${(value * 100).toFixed(1)}%`,
                  name === "patient"
                    ? "Current Patient"
                    : name === "high_risk"
                      ? "High Risk Group"
                      : name === "medium_risk"
                        ? "Medium Risk Group"
                        : "Low Risk Group",
                ]}
                labelFormatter={(month) => `Month ${month}`}
              />
              <Legend />
              <Line type="monotone" dataKey="patient" stroke="#3b82f6" strokeWidth={3} name="Current Patient" />
              <Line
                type="monotone"
                dataKey="high_risk"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="High Risk"
              />
              <Line
                type="monotone"
                dataKey="medium_risk"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Medium Risk"
              />
              <Line
                type="monotone"
                dataKey="low_risk"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Low Risk"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Kaplan-Meier Curves */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Kaplan-Meier Survival Estimation</CardTitle>
          <CardDescription>Non-parametric survival function with risk group stratification</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={kaplanMeierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Survival Probability", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${(value * 100).toFixed(1)}%`,
                  name === "km_estimate"
                    ? "Kaplan-Meier Estimate"
                    : name === "km_upper"
                      ? "Upper 95% CI"
                      : name === "km_lower"
                        ? "Lower 95% CI"
                        : name === "population"
                          ? "Population Average"
                          : name,
                ]}
                labelFormatter={(month) => `Month ${month}`}
              />
              <Legend />
              <Area type="monotone" dataKey="km_upper" stackId="1" stroke="none" fill="#10b981" fillOpacity={0.1} />
              <Area type="monotone" dataKey="km_lower" stackId="1" stroke="none" fill="#ffffff" fillOpacity={1} />
              <Line
                type="stepAfter"
                dataKey="km_estimate"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="Kaplan-Meier Estimate"
              />
              <Line
                type="monotone"
                dataKey="population"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                name="Population Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
