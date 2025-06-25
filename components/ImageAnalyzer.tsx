"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function ImageAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [textResult, setTextResult] = useState<TextResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setAnalysis(null);
    setTextResult(null);

    if (selectedFile) {
      setImageUrl(URL.createObjectURL(selectedFile));
    } else {
      setImageUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `analyze/${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);
      if (storageError) {
        throw storageError;
      }
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      const publicImageUrl = publicUrlData.publicUrl;
      if (!publicImageUrl) {
        throw new Error("Failed to get public image URL");
      }

      const [analysisResponse, textResponse] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: publicImageUrl,
            analysisType: "detailed",
          }),
        }),
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: publicImageUrl,
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6">
        <h2 className="text-xl font-bold mb-4">Upload Image for Analysis</h2>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {imageUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full h-auto max-h-64 rounded-lg shadow-sm"
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>

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
        </div>
      )}

      {textResult && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mt-6">
          <h3 className="text-xl font-bold mb-4">Text Extraction</h3>
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
