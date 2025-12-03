"use client"

import { useState } from "react"
import { Button } from "@/frontend/components/ui/button"
import { CardContent } from "@/frontend/components/ui/card"
import { Alert, AlertDescription } from "@/frontend/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AmharicNewsClassifier() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<{ category: string; confidence: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClassify = async () => {
    if (!text.trim()) {
      setError("Please enter some text to classify")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      const category = data.category || data.prediction || "Unknown"
      const confidence = data.confidence || 0.95
      setResult({ category, confidence })
    } catch {
      setError("Classification failed. Please check your API server.")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string; gradient: string } } = {
      politics: {
        bg: "bg-blue-500/80",
        text: "text-blue-50",
        gradient: "from-blue-500 to-blue-400",
      },
      sports: {
        bg: "bg-green-500/80",
        text: "text-green-50",
        gradient: "from-green-500 to-green-400",
      },
      "local news": {
        bg: "bg-purple-500/80",
        text: "text-purple-50",
        gradient: "from-purple-500 to-purple-400",
      },
      technology: {
        bg: "bg-cyan-500/80",
        text: "text-cyan-50",
        gradient: "from-cyan-500 to-cyan-400",
      },
      entertainment: {
        bg: "bg-pink-500/80",
        text: "text-pink-50",
        gradient: "from-pink-500 to-pink-400",
      },
      business: {
        bg: "bg-amber-500/80",
        text: "text-amber-50",
        gradient: "from-amber-500 to-amber-400",
      },
      health: {
        bg: "bg-red-500/80",
        text: "text-red-50",
        gradient: "from-red-500 to-red-400",
      },
    }
    return (
      colors[category.toLowerCase()] || {
        bg: "bg-slate-500/80",
        text: "text-slate-50",
        gradient: "from-slate-500 to-slate-400",
      }
    )
  }

  const categoryColors = getCategoryColor(result?.category || "")

  return (
    /* Updated background to deeper charcoal with subtle animations matching v0 dark theme */
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-900/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        {/* Main Card */}
        <div className="backdrop-blur-md bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden hover:border-slate-600/50 transition-colors duration-300">
          <div className="bg-slate-900/30 px-8 py-12 text-center border-b border-slate-700/30">
            <h1 className="text-4xl font-bold tracking-tight text-slate-100 mb-3">
              Amharic News Classification Dashboard
            </h1>
            <p className="text-base text-slate-400 font-light">
              Paste any news article below and instantly get its category
            </p>
          </div>

          <CardContent className="px-8 py-8 space-y-6">
            {/* Text Area */}
            <div className="space-y-3">
              <label htmlFor="news-input" className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                News Article Text
              </label>
              <textarea
                id="news-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste Amharic news text here..."
                className="w-full min-h-[260px] p-4 backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-300 hover:bg-slate-800/60"
              />
            </div>

            {/* Classify Button */}
            <Button
              onClick={handleClassify}
              disabled={loading}
              className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Classifying…
                </>
              ) : (
                "Classify News"
              )}
            </Button>
          </CardContent>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="backdrop-blur-md bg-red-950/40 border border-red-800/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-red-200 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Result Card */}
        {result && (
          <div className="backdrop-blur-md bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 hover:border-slate-600/50 transition-colors duration-300">
            <div className="px-8 py-8 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Predicted Category
                </h2>
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-base ${categoryColors.bg} ${categoryColors.text} shadow-lg transform hover:scale-105 transition-transform duration-200`}
                >
                  {result.category}
                </div>
              </div>

              {/* Confidence Score */}
              <div className="space-y-3 pt-4 border-t border-slate-700/30">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Confidence Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/30">
                      <div
                        className={`h-full bg-gradient-to-r ${categoryColors.gradient} transition-all duration-500`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-slate-200">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
