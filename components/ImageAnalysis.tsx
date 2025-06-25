"use client";
import { useState } from "react";

interface AnalysisResult {
  objects: string[];
  scene: string;
  colors: string[];
  mood: string;
  details: string;
  suggestions: string[];
}

interface TextResult {
  text: string;
  confidence: number;
}

export default function ImageAnalysis({ imageUrl }: { imageUrl: string }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [textResult, setTextResult] = useState<TextResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analysisResponse, textResponse] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            analysisType: "detailed",
          }),
        }),
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            analysisType: "text",
          }),
        }),
      ]);

      if (!analysisResponse.ok || !textResponse.ok) {
        throw new Error("Failed to analyze image");
      }

      const [analysisResult, textResult] = await Promise.all([
        analysisResponse.json(),
        textResponse.json(),
      ]);

      setAnalysis(analysisResult);
      setTextResult(textResult);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Image Analysis</h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">
                Objects Detected
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.objects.map((object, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {object}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">Colors</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.colors.map((color, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">
              Scene Description
            </h4>
            <p className="text-gray-700">{analysis.scene}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">
              Mood & Atmosphere
            </h4>
            <p className="text-gray-700">{analysis.mood}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">
              Detailed Analysis
            </h4>
            <p className="text-gray-700">{analysis.details}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Suggestions</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {textResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-800 mb-2">Extracted Text</h4>
          {textResult.text !== "No text detected" ? (
            <div>
              <p className="text-gray-700 mb-2">{textResult.text}</p>
              <p className="text-sm text-gray-500">
                Confidence: {(textResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No text detected in the image</p>
          )}
        </div>
      )}
    </div>
  );
}
