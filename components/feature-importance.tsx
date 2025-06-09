"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface FeatureImportanceProps {
  features: Array<{ feature: string; importance: number }>
}

export function FeatureImportance({ features }: FeatureImportanceProps) {
  const maxImportance = Math.max(...features.map((f) => f.importance))
  const normalizedFeatures = features.map((f) => ({
    ...f,
    normalizedImportance: (f.importance / maxImportance) * 100,
  }))

  const getFeatureCategory = (feature: string) => {
    const clinical = [
      "age",
      "tumor stage",
      "tumor size",
      "lymph node",
      "treatment",
      "er status",
      "pr status",
      "her2 status",
    ]
    const molecular = ["tp53", "brca1", "gene expression", "methylation", "mirna"]

    const featureLower = feature.toLowerCase()
    if (clinical.some((c) => featureLower.includes(c))) return "clinical"
    if (molecular.some((m) => featureLower.includes(m))) return "molecular"
    return "other"
  }

  const getFeatureColor = (category: string) => {
    switch (category) {
      case "clinical":
        return "#3b82f6"
      case "molecular":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Importance Ranking</CardTitle>
          <CardDescription>Most influential factors in survival prediction (SHAP values)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {normalizedFeatures.map((feature, index) => {
              const category = getFeatureCategory(feature.feature)
              return (
                <div key={feature.feature} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}. {feature.feature}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          category === "clinical"
                            ? "bg-blue-100 text-blue-700"
                            : category === "molecular"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {category}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">{(feature.importance * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={feature.normalizedImportance} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Impact Visualization</CardTitle>
          <CardDescription>Relative contribution of each feature to the prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={normalizedFeatures} layout="horizontal" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 100]}
                label={{ value: "Importance (%)", position: "insideBottom", offset: -5 }}
              />
              <YAxis type="category" dataKey="feature" width={80} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Importance"]} />
              <Bar dataKey="normalizedImportance" radius={[0, 4, 4, 0]}>
                {normalizedFeatures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getFeatureColor(getFeatureCategory(entry.feature))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Feature Categories</CardTitle>
          <CardDescription>Understanding the types of features contributing to the prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold">Clinical Features</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Traditional clinical parameters used in cancer prognosis</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Patient demographics (age, gender)</li>
                <li>• Tumor characteristics (stage, size, grade)</li>
                <li>• Treatment history and response</li>
                <li>• Biomarker status (ER, PR, HER2)</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold">Molecular Features</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Multi-omics data providing deeper biological insights</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Gene expression profiles</li>
                <li>• DNA methylation patterns</li>
                <li>• miRNA expression levels</li>
                <li>• Protein abundance data</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold">Model Insights</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Algorithm-specific feature interactions and patterns</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Non-linear feature interactions</li>
                <li>• Temporal dependencies</li>
                <li>• Cross-omics correlations</li>
                <li>• Hidden prognostic signatures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
