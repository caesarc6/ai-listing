import UploadForm from "@/components/UploadForm";
import { HeroHeader } from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <>
      <HeroHeader />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <div className="w-full max-w-4xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-center">
              Upload & Analyze Images
            </h1>
            <Button asChild variant="outline">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
          <p className="text-gray-600 text-center mb-8">
            Upload your images and get comprehensive AI-powered analysis
            including object detection, scene description, color analysis, and
            text extraction. Your products will automatically appear in your
            dashboard with AI-generated titles and descriptions.
          </p>
          <UploadForm />
        </div>
      </main>
    </>
  );
}
