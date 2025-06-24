import UploadForm from "@/components/UploadForm";
import { HeroHeader } from "@/components/header";

export default function UploadPage() {
  return (
    <>
      <HeroHeader />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Upload a Product</h1>
        <UploadForm />
      </main>
    </>
  );
}
