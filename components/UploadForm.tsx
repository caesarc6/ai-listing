"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateProductInfo } from "@/lib/openai";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
    setSuccess(false);
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
      const imageUrl = publicUrlData.publicUrl;
      // 3. Call OpenAI Vision API for title/description
      const { title, description } = await generateProductInfo(imageUrl);
      // 4. Insert listing into DB
      const { error: dbError } = await supabase.from("listings").insert([
        {
          user_id: user.id,
          image_url: imageUrl,
          title,
          description,
        },
      ]);
      if (dbError) throw dbError;
      setSuccess(true);
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto mt-8"
    >
      <h2 className="text-xl font-bold mb-4">Upload a Product</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 w-full"
        disabled={uploading}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 mb-2">
          Product uploaded successfully!
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
