"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface FileUploadProps {
  onPredictionComplete: (results: any) => void
}

export function FileUpload({ onPredictionComplete }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    if (csvFile) {
      setUploadedFile(csvFile)
      setUploadStatus("success")
      setError(null)
    } else {
      setUploadStatus("error")
      setError("Please upload a valid CSV file")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setUploadedFile(file)
      setUploadStatus("success")
      setError(null)
    } else {
      setUploadStatus("error")
      setError("Please upload a valid CSV file")
    }
  }

  const processFile = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const results = await response.json()
      onPredictionComplete(results)
    } catch (error) {
      console.error("File processing error:", error)
      setError(error.message || "Failed to process file. Please try again.")
      setUploadStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `patient_id,age,gender,tumor_stage,tumor_size,lymph_nodes,histological_grade,er_status,pr_status,her2_status,treatment_history,tp53_expression,brca1_expression,methylation_score,mirna_profile
PATIENT_001,65,female,II,2.3,1,2,positive,positive,negative,chemotherapy,2.45,1.23,0.67,3.21
PATIENT_002,58,female,I,1.8,0,1,positive,negative,negative,surgery,1.89,2.14,0.45,2.87
PATIENT_003,72,male,III,3.1,3,3,negative,negative,positive,combination,3.22,0.98,0.78,4.12`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cancer_survival_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Upload Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Template Download */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Download Template</h3>
              <p className="text-sm text-gray-600 mt-1">Get the CSV template with required columns and sample data</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : uploadStatus === "success"
              ? "border-green-400 bg-green-50"
              : uploadStatus === "error"
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            {uploadStatus === "success" ? (
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            ) : uploadStatus === "error" ? (
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}

            {uploadedFile ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">File Ready for Processing</h3>
                <p className="text-gray-600 mb-4">
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </p>
                <Badge variant="secondary" className="mb-4">
                  CSV File Detected
                </Badge>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {uploadStatus === "error" ? "Invalid File Type" : "Upload CSV File"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {uploadStatus === "error"
                    ? "Please upload a valid CSV file with patient data"
                    : "Drag and drop your CSV file here, or click to browse"}
                </p>
              </div>
            )}

            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="file-upload" />

            {!uploadedFile && (
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Button */}
      {uploadedFile && uploadStatus === "success" && (
        <Button
          onClick={processFile}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing {uploadedFile.name}...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process File
            </>
          )}
        </Button>
      )}

      {/* File Requirements */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">File Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• CSV format with comma-separated values</li>
            <li>• First row should contain column headers</li>
            <li>• Include patient_id column for identification</li>
            <li>• Clinical data: age, gender, tumor_stage, etc.</li>
            <li>• Molecular data: gene expression, methylation scores (optional)</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
