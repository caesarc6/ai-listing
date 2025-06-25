import { HeroHeader } from "@/components/header";
import ImageAnalyzer from "@/components/ImageAnalyzer";

export default function AnalyzePage() {
  return (
    <>
      <HeroHeader />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            AI Image Analysis
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload any image to get comprehensive AI-powered analysis. No data
            is stored - this is for analysis purposes only.
          </p>
          <ImageAnalyzer />
        </div>
      </main>
    </>
  );
}
