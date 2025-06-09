import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Database, LineChart, Upload } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CancerSurv AI</h1>
                <p className="text-xs text-gray-600">Clinical & Multi-Omics Analysis</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/predict" className="text-gray-600 hover:text-blue-600 transition-colors">
                Predict
              </Link>
              <Link href="/models" className="text-gray-600 hover:text-blue-600 transition-colors">
                Models
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            RV College of Engineering • Information Science & Engineering
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Cancer Survival
            <span className="text-blue-600"> Prediction</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced algorithmic models for predicting patient survival outcomes using integrated clinical and
            multi-omics data. Powered by Cox Proportional Hazards, Random Survival Forests, and DeepSurv algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/predict">
                Start Prediction <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Survival Analysis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform integrates multiple state-of-the-art algorithms to provide accurate and interpretable cancer
              survival predictions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Database className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Omics Integration</CardTitle>
                <CardDescription>
                  Combines clinical features with gene expression, DNA methylation, and miRNA profiles for comprehensive
                  analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Advanced ML Models</CardTitle>
                <CardDescription>
                  Cox Proportional Hazards, Random Survival Forests, and DeepSurv algorithms optimized for survival
                  prediction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <LineChart className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Interactive Visualization</CardTitle>
                <CardDescription>
                  Survival curves, feature importance analysis, and risk assessment with SHAP explanations for
                  interpretability.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Implemented Models</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each model is analyzed for time and space complexity, with optimizations for scalability and accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cox Proportional Hazards</CardTitle>
                <CardDescription>Semi-parametric regression model with LASSO regularization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Complexity:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">O(n²)</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interpretability:</span>
                    <Badge variant="secondary" className="text-xs">
                      High
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Random Survival Forest</CardTitle>
                <CardDescription>Ensemble method handling nonlinear relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Complexity:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">O(nt log t)</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interpretability:</span>
                    <Badge variant="secondary" className="text-xs">
                      Medium
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">DeepSurv</CardTitle>
                <CardDescription>Deep learning Cox model for complex patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Complexity:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">O(ep·d·n)</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interpretability:</span>
                    <Badge variant="secondary" className="text-xs">
                      Low
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kaplan-Meier</CardTitle>
                <CardDescription>Non-parametric survival function estimation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Complexity:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">O(n log n)</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interpretability:</span>
                    <Badge variant="secondary" className="text-xs">
                      High
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Analyze Survival Data?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Upload your clinical and multi-omics data or use our sample datasets to explore the power of advanced
            survival analysis algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/predict">
                <Upload className="mr-2 w-4 h-4" />
                Upload Data
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">CancerSurv AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced cancer survival prediction using clinical and multi-omics data analysis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Project</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Kushagra Bashisth (1RV23IS064)</li>
                <li>Mohammad Oweis (1RV23IS072)</li>
                <li>RV College of Engineering</li>
                <li>AY: 2024-25</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Multi-Omics Integration</li>
                <li>Survival Analysis</li>
                <li>Feature Selection</li>
                <li>Model Comparison</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Datasets</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>TCGA</li>
                <li>METABRIC</li>
                <li>Clinical Data</li>
                <li>Gene Expression</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 Cancer Survival Prediction Project. Department of Information Science and Engineering, RV
              College of Engineering.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
