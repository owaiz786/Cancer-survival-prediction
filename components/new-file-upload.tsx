"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
  Users,
  BarChart3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NewFileUploadProps {
  onPredictionComplete: (results: any) => void
}

export function NewFileUpload({ onPredictionComplete }: NewFileUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<{
    headers: string[]
    rows: string[][]
    totalRows: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return

      // Validate file
      if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
        setError("Please upload a CSV file")
        setUploadState("error")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        setUploadState("error")
        return
      }

      setUploadedFile(file)
      setUploadState("uploading")
      setError(null)
      setProgress(20)

      try {
        // Read and preview file
        const text = await file.text()
        setProgress(40)

        // Parse CSV for preview
        const lines = text.split("\n").filter((line) => line.trim())
        if (lines.length < 2) {
          throw new Error("CSV must contain at least a header row and one data row")
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const previewRows = lines
          .slice(1, 6)
          .map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

        setFilePreview({
          headers,
          rows: previewRows,
          totalRows: lines.length - 1,
        })

        setProgress(60)
        setUploadState("success")
        setProgress(100)

        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for analysis`,
        })
      } catch (err) {
        setError(err.message || "Failed to read file")
        setUploadState("error")
        toast({
          title: "Upload failed",
          description: err.message || "Could not process the uploaded file",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      const csvFile = files.find((file) => file.name.endsWith(".csv") || file.type === "text/csv")
      if (csvFile) {
        handleFileSelect(csvFile)
      }
    },
    [handleFileSelect],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const processFile = async () => {
    if (!uploadedFile) return

    setUploadState("processing")
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`)
      }

      const results = await response.json()

      toast({
        title: "Analysis complete!",
        description: `Successfully analyzed ${results.totalPatients} patients`,
      })

      onPredictionComplete(results)
    } catch (err) {
      setError(err.message || "Analysis failed")
      setUploadState("error")
      toast({
        title: "Analysis failed",
        description: err.message || "Could not analyze the uploaded file",
        variant: "destructive",
      })
    }
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setFilePreview(null)
    setUploadState("idle")
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadTemplate = () => {
    const csvContent = `patient_id,age,gender,tumor_stage,tumor_size,lymph_nodes,histological_grade,er_status,pr_status,her2_status,treatment_history
PATIENT_001,65,female,II,2.3,1,2,positive,positive,negative,chemotherapy
PATIENT_002,58,female,I,1.8,0,1,positive,negative,negative,surgery
PATIENT_003,72,male,III,3.1,3,3,negative,negative,positive,combination
PATIENT_004,61,female,II,2.7,2,2,positive,positive,negative,radiation
PATIENT_005,69,male,IV,4.2,5,3,negative,negative,negative,palliative`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "patient_data_template.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Template downloaded",
      description: "CSV template saved to your downloads",
    })
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900">Upload Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <Button variant="outline" size="sm" onClick={resetUpload} className="mt-3">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Download */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">CSV Template</h3>
                <p className="text-sm text-gray-600">Download the template with required columns</p>
              </div>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          uploadState === "success"
            ? "border-green-300 bg-green-50"
            : uploadState === "error"
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            {uploadState === "success" ? (
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            ) : uploadState === "error" ? (
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            ) : uploadState === "uploading" ? (
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            ) : (
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}

            {uploadedFile ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {uploadState === "success" ? "File Ready for Analysis" : "Processing File..."}
                </h3>
                <p className="text-gray-600 mb-4">
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </p>

                {uploadState === "uploading" && (
                  <div className="w-full max-w-xs mx-auto mb-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
                  </div>
                )}

                <div className="flex justify-center space-x-2 mb-4">
                  <Badge variant="secondary">CSV File</Badge>
                  {filePreview && <Badge variant="outline">{filePreview.totalRows} patients</Badge>}
                </div>

                <Button variant="outline" onClick={resetUpload} size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Patient Data</h3>
                <p className="text-gray-600 mb-6">Drag and drop your CSV file here, or click to browse</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />

                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" size="lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Choose CSV File
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Preview */}
      {filePreview && uploadState === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Data Preview</span>
              <Badge variant="secondary">{filePreview.totalRows} total patients</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {filePreview.headers.map((header, i) => (
                      <th key={i} className="text-left p-2 font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filePreview.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {row.map((cell, j) => (
                        <td key={j} className="p-2 text-gray-600">
                          {cell || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filePreview.totalRows > 5 && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Showing first 5 rows of {filePreview.totalRows} patients
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Button */}
      {uploadedFile && uploadState === "success" && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ready for Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Start AI-powered survival analysis on {filePreview?.totalRows} patients
                  </p>
                </div>
              </div>
              <Button
                onClick={processFile}
                disabled={uploadState === "processing"}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {uploadState === "processing" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Analyze Patients
                  </>
                )}
              </Button>
            </div>

            {uploadState === "processing" && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Running ML models... {progress}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">File Requirements:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Format:</h5>
              <ul className="space-y-1">
                <li>• CSV format with comma separators</li>
                <li>• First row must contain headers</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Required Columns:</h5>
              <ul className="space-y-1">
                <li>
                  • <code className="bg-gray-200 px-1 rounded">patient_id</code> - Unique identifier
                </li>
                <li>
                  • <code className="bg-gray-200 px-1 rounded">age</code> - Patient age
                </li>
                <li>
                  • <code className="bg-gray-200 px-1 rounded">tumor_stage</code> - Cancer stage (I-IV)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
