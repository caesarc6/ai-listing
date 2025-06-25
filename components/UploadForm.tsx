"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageAnalysis from "./ImageAnalysis";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<
    string | null
  >(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setShowAnalysis(false);
    setGeneratedTitle(null);
    setGeneratedDescription(null);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      // 1. Upload image to Supabase Storage
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);
      if (storageError) {
        console.log(storageError);
        throw storageError;
      }
      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      const uploadedImageUrl = publicUrlData.publicUrl;

      // 3. Call API route for title/description
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          analysisType: "product",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const { title, description } = await response.json();
      setGeneratedTitle(title);
      setGeneratedDescription(description);

      // 4. Insert listing into DB
      const { error: dbError } = await supabase.from("listings").insert([
        {
          user_id: user.id,
          image_url: uploadedImageUrl,
          title,
          description,
        },
      ]);
      if (dbError) throw dbError;
      setSuccess(true);
      setFile(null);
      setImageUrl(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Upload a Product</h2>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={uploading}
          />
        </div>

        {imageUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <div className="relative">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-64 rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
              >
                {showAnalysis ? "Hide Analysis" : "Show Analysis"}
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Analyzing image with AI...</span>
            </div>
          </div>
        )}

        {generatedTitle && generatedDescription && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              AI Generated Content:
            </h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-green-700">Title:</span>
                <p className="text-green-800">{generatedTitle}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Description:</span>
                <p className="text-green-800">{generatedDescription}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mb-4 p-3 bg-green-50 rounded">
            Product uploaded successfully! You can view it in your dashboard.
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={uploading || !file}
        >
          {uploading ? "Uploading & Analyzing..." : "Upload Product"}
        </button>
      </form>

      {showAnalysis && imageUrl && <ImageAnalysis imageUrl={imageUrl} />}
    </div>
  );
}
