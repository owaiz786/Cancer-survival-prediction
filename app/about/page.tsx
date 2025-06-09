import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, BookOpen, Target, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">About the Project</h1>
              <p className="text-sm text-gray-600">Clinical and Multi-Omics Data Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Project Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Cancer prognosis and survival prediction are critical challenges in biomedical research, especially
                given the high dimensionality and complexity of clinical and multi-omics data. This project aims to
                design and analyze algorithmic models that can accurately predict patient survival outcomes using
                integrated datasets comprising clinical features and multi-omics data.
              </p>

              <p className="text-gray-700 leading-relaxed">
                By applying survival analysis algorithms—such as the Cox Proportional Hazards model, Kaplan-Meier
                estimator, Random Survival Forests, and DeepSurv—this study evaluates their performance based on key
                metrics including the Concordance Index (C-index), Brier score, and Log-rank test.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Clinical Data</h4>
                  <p className="text-sm text-blue-700">
                    Age, tumor stage, treatment history, biomarker status, and other clinical parameters
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Multi-Omics Data</h4>
                  <p className="text-sm text-green-700">
                    Gene expression, DNA methylation, miRNA profiles, and protein abundance data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Project Team</span>
              </CardTitle>
              <CardDescription>
                Department of Information Science and Engineering, RV College of Engineering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-blue-600">KB</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Kushagra Bashisth</h3>
                  <p className="text-sm text-gray-600">USN: 1RV23IS064</p>
                  <Badge variant="secondary" className="mt-2">
                    Lead Developer
                  </Badge>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-green-600">MO</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Mohammad Oweis</h3>
                  <p className="text-sm text-gray-600">USN: 1RV23IS072</p>
                  <Badge variant="secondary" className="mt-2">
                    ML Engineer
                  </Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Academic Year:</strong> 2024-25 |<strong> Course:</strong> CD343AI - Clinical and Multi-Omics
                  Data Analysis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Project Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-gray-700">
                    Collect and preprocess clinical and multi-omics datasets relevant to cancer survival analysis
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p className="text-gray-700">
                    Perform feature selection and dimensionality reduction using LASSO, PCA, and mutual information
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p className="text-gray-700">
                    Implement and compare Cox Proportional Hazards, Kaplan-Meier, Random Survival Forests, and DeepSurv
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">4</span>
                  </div>
                  <p className="text-gray-700">
                    Analyze time and space complexity of implemented algorithms from a DAA perspective
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">5</span>
                  </div>
                  <p className="text-gray-700">
                    Evaluate model performance using C-index, Brier Score, and Log-Rank Test metrics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Methodology</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Processing</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• TCGA and METABRIC dataset integration</li>
                    <li>• Missing value imputation techniques</li>
                    <li>• Feature normalization and scaling</li>
                    <li>• Clinical and omics data merging</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Model Development</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Survival analysis algorithm implementation</li>
                    <li>• Cross-validation for robustness</li>
                    <li>• Hyperparameter optimization</li>
                    <li>• Performance metric evaluation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Feature Engineering</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• LASSO regularization for selection</li>
                    <li>• PCA for dimensionality reduction</li>
                    <li>• Correlation analysis</li>
                    <li>• Mutual information scoring</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Interpretation</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SHAP explanations for interpretability</li>
                    <li>• Feature importance analysis</li>
                    <li>• Survival curve visualization</li>
                    <li>• Clinical relevance assessment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expected Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Expected Outcomes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Accurate Prediction Models</h4>
                  <p className="text-sm text-blue-700">
                    Development of reliable survival prediction models integrating clinical and multi-omics data
                  </p>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Comparative Analysis</h4>
                  <p className="text-sm text-green-700">
                    Performance comparison of traditional statistical and machine learning models
                  </p>
                </div>

                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-2">Biomarker Discovery</h4>
                  <p className="text-sm text-purple-700">
                    Identification of key predictive biomarkers for therapeutic targeting
                  </p>
                </div>

                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-semibold text-orange-900 mb-2">Algorithmic Insights</h4>
                  <p className="text-sm text-orange-700">
                    Computational efficiency analysis and scalability improvements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Software & Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Machine Learning</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">scikit-learn</Badge>
                    <Badge variant="outline">lifelines</Badge>
                    <Badge variant="outline">TensorFlow</Badge>
                    <Badge variant="outline">PyTorch</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Analysis</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">pandas</Badge>
                    <Badge variant="outline">NumPy</Badge>
                    <Badge variant="outline">matplotlib</Badge>
                    <Badge variant="outline">seaborn</Badge>
                    <Badge variant="outline">SHAP</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Web Platform</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Next.js</Badge>
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Flask</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
