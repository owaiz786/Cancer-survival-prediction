import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, TreePine, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function ModelsPage() {
  const models = [
    {
      name: "Cox Proportional Hazards",
      icon: BarChart3,
      type: "Statistical",
      complexity: "O(n²)",
      description:
        "Semi-parametric regression model that estimates the effect of covariates on the hazard rate without making assumptions about the baseline hazard function.",
      strengths: [
        "High interpretability",
        "Well-established in clinical practice",
        "Handles censored data naturally",
        "Provides hazard ratios",
      ],
      limitations: [
        "Assumes proportional hazards",
        "Linear relationships only",
        "Sensitive to outliers",
        "Struggles with high-dimensional data",
      ],
      applications: "Standard clinical survival analysis, biomarker studies, treatment effect estimation",
    },
    {
      name: "Random Survival Forest",
      icon: TreePine,
      type: "Machine Learning",
      complexity: "O(nt log t)",
      description:
        "Ensemble method that extends Random Forests to survival analysis, building multiple survival trees and aggregating their predictions.",
      strengths: [
        "Handles non-linear relationships",
        "Built-in feature selection",
        "Robust to missing data",
        "No distributional assumptions",
      ],
      limitations: [
        "Less interpretable than Cox",
        "Computationally intensive",
        "May overfit with small samples",
        "Hyperparameter tuning required",
      ],
      applications: "Multi-omics integration, complex feature interactions, high-dimensional genomic data",
    },
    {
      name: "DeepSurv",
      icon: Brain,
      type: "Deep Learning",
      complexity: "O(ep·d·n)",
      description:
        "Deep neural network implementation of the Cox model that can capture complex non-linear relationships and interactions between features.",
      strengths: [
        "Captures complex patterns",
        "Handles high-dimensional data",
        "Flexible architecture",
        "State-of-the-art performance",
      ],
      limitations: ["Black box model", "Requires large datasets", "Computationally expensive", "Prone to overfitting"],
      applications: "Large-scale genomic studies, multi-modal data fusion, precision medicine",
    },
    {
      name: "Kaplan-Meier",
      icon: Activity,
      type: "Non-parametric",
      complexity: "O(n log n)",
      description:
        "Non-parametric estimator that provides step-function estimates of the survival probability without making assumptions about the underlying survival distribution. Essential for baseline survival estimation and group comparisons.",
      strengths: [
        "No distributional assumptions required",
        "Simple and intuitive interpretation",
        "Widely accepted clinical standard",
        "Excellent for survival curve visualization",
        "Handles censored data naturally",
      ],
      limitations: [
        "Cannot adjust for covariates",
        "Purely descriptive, not predictive",
        "Limited to univariate analysis",
        "No individual risk stratification",
        "Requires sufficient sample size",
      ],
      applications:
        "Baseline survival estimation, treatment group comparison, clinical trial reporting, population-level survival analysis",
    },
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Survival Analysis Models</h1>
              <p className="text-sm text-gray-600">Algorithmic approaches to cancer survival prediction</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Survival Analysis Algorithms</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform implements multiple state-of-the-art algorithms for cancer survival prediction, each
              optimized for different data types and clinical scenarios. Below is a comprehensive analysis of each
              model's design, complexity, and applications.
            </p>
          </div>

          {/* Models Grid */}
          <div className="space-y-8">
            {models.map((model, index) => {
              const IconComponent = model.icon
              return (
                <Card key={model.name} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{model.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{model.type}</Badge>
                            <Badge variant="outline" className="font-mono text-xs">
                              {model.complexity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-4 text-base">{model.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Strengths */}
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Strengths</h4>
                        <ul className="space-y-2">
                          {model.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations */}
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3">Limitations</h4>
                        <ul className="space-y-2">
                          {model.limitations.map((limitation, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Applications */}
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Best Applications</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{model.applications}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Comparison Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Model Comparison Matrix</CardTitle>
              <CardDescription>
                Quick reference for selecting the appropriate algorithm based on your requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Model</th>
                      <th className="text-left p-3 font-semibold">Interpretability</th>
                      <th className="text-left p-3 font-semibold">Performance</th>
                      <th className="text-left p-3 font-semibold">Data Size</th>
                      <th className="text-left p-3 font-semibold">Computational Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Cox Proportional Hazards</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">High</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Small-Medium</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Low</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Random Survival Forest</td>
                      <td className="p-3">
                        <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">High</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Medium-Large</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">DeepSurv</td>
                      <td className="p-3">
                        <Badge className="bg-red-100 text-red-700">Low</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Very High</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-yellow-100 text-yellow-700">Large</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-red-100 text-red-700">High</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Kaplan-Meier</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Very High</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-red-100 text-red-700">Low</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Any</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-700">Very Low</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Notes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Implementation & Optimization</CardTitle>
              <CardDescription>
                Technical considerations for deploying these models in clinical settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Algorithmic Optimizations</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• LASSO regularization for feature selection</li>
                    <li>• Principal Component Analysis (PCA) for dimensionality reduction</li>
                    <li>• Cross-validation for hyperparameter tuning</li>
                    <li>• Ensemble methods for improved robustness</li>
                    <li>• GPU acceleration for deep learning models</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Clinical Integration</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SHAP explanations for model interpretability</li>
                    <li>• Confidence intervals for uncertainty quantification</li>
                    <li>• Real-time prediction APIs</li>
                    <li>• Integration with electronic health records</li>
                    <li>• Continuous model updating and validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
