"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InputFormProps {
  onPredictionComplete: (results: any) => void
}

export function InputForm({ onPredictionComplete }: InputFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Clinical Data
    age: "",
    gender: "",
    tumorStage: "",
    tumorSize: "",
    lymphNodes: "",
    histologicalGrade: "",
    erStatus: "",
    prStatus: "",
    her2Status: "",
    treatmentHistory: "",

    // Molecular Data (simplified for demo)
    tp53Expression: "",
    brca1Expression: "",
    methylationScore: "",
    mirnaProfile: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    // Basic validation - at least age and gender should be provided
    if (!formData.age || !formData.gender) {
      setError("Please provide at least age and gender for basic prediction")
      return false
    }

    const age = Number.parseFloat(formData.age)
    if (isNaN(age) || age < 0 || age > 120) {
      setError("Please enter a valid age between 0 and 120")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const results = await response.json()

      toast({
        title: "Prediction Complete",
        description: `Analysis completed using ${results.modelUsed || "ML models"}`,
      })

      onPredictionComplete(results)
    } catch (error) {
      console.error("Error during prediction:", error)
      setError(error.message || "Failed to process prediction. Please try again.")

      toast({
        title: "Prediction Error",
        description: "Failed to process your request. Please check your input and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Validation Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Clinical Data Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">Clinical Data</Badge>
          <span className="text-sm text-gray-600">Patient demographics and clinical features</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 65"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tumorStage">Tumor Stage</Label>
            <Select value={formData.tumorStage} onValueChange={(value) => handleInputChange("tumorStage", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I">Stage I</SelectItem>
                <SelectItem value="II">Stage II</SelectItem>
                <SelectItem value="III">Stage III</SelectItem>
                <SelectItem value="IV">Stage IV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tumorSize">Tumor Size (cm)</Label>
            <Input
              id="tumorSize"
              type="number"
              step="0.1"
              placeholder="e.g., 2.5"
              value={formData.tumorSize}
              onChange={(e) => handleInputChange("tumorSize", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lymphNodes">Lymph Nodes Positive</Label>
            <Input
              id="lymphNodes"
              type="number"
              placeholder="e.g., 3"
              value={formData.lymphNodes}
              onChange={(e) => handleInputChange("lymphNodes", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="histologicalGrade">Histological Grade</Label>
            <Select
              value={formData.histologicalGrade}
              onValueChange={(value) => handleInputChange("histologicalGrade", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="erStatus">ER Status</Label>
            <Select value={formData.erStatus} onValueChange={(value) => handleInputChange("erStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prStatus">PR Status</Label>
            <Select value={formData.prStatus} onValueChange={(value) => handleInputChange("prStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="her2Status">HER2 Status</Label>
            <Select value={formData.her2Status} onValueChange={(value) => handleInputChange("her2Status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Molecular Data Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">Molecular Data</Badge>
          <span className="text-sm text-gray-600">Gene expression and omics profiles (optional)</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tp53Expression">TP53 Expression Level</Label>
            <Input
              id="tp53Expression"
              type="number"
              step="0.01"
              placeholder="e.g., 2.45"
              value={formData.tp53Expression}
              onChange={(e) => handleInputChange("tp53Expression", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brca1Expression">BRCA1 Expression Level</Label>
            <Input
              id="brca1Expression"
              type="number"
              step="0.01"
              placeholder="e.g., 1.23"
              value={formData.brca1Expression}
              onChange={(e) => handleInputChange("brca1Expression", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="methylationScore">DNA Methylation Score</Label>
            <Input
              id="methylationScore"
              type="number"
              step="0.01"
              placeholder="e.g., 0.67"
              value={formData.methylationScore}
              onChange={(e) => handleInputChange("methylationScore", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mirnaProfile">miRNA Profile Score</Label>
            <Input
              id="mirnaProfile"
              type="number"
              step="0.01"
              placeholder="e.g., 3.21"
              value={formData.mirnaProfile}
              onChange={(e) => handleInputChange("mirnaProfile", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Treatment History */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">Treatment History</Badge>
          <span className="text-sm text-gray-600">Previous treatments and interventions</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatmentHistory">Treatment Type</Label>
          <Select
            value={formData.treatmentHistory}
            onValueChange={(value) => handleInputChange("treatmentHistory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select treatment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="surgery">Surgery Only</SelectItem>
              <SelectItem value="chemotherapy">Chemotherapy</SelectItem>
              <SelectItem value="radiation">Radiation Therapy</SelectItem>
              <SelectItem value="combination">Combination Therapy</SelectItem>
              <SelectItem value="none">No Treatment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Fields marked with * are required. Additional clinical and molecular data will improve
          prediction accuracy. This demo uses integrated ML models for immediate results.
        </p>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing with ML Models...
          </>
        ) : (
          <>
            <Brain className="mr-2 h-4 w-4" />
            Predict Survival
          </>
        )}
      </Button>
    </form>
  )
}
