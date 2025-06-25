import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="bg-muted/50 overflow-hidden">
        <section>
          <div className="relative py-24">
            <div className="mx-auto max-w-5xl px-6">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-center text-indigo-300 mt-8 max-w-2xl text-balance text-5xl font-bold lg:text-6xl">
                  AI-Powered Image Analysis
                </h1>
                <p className="text-center text-foreground mt-6 max-w-2xl text-balance text-2xl">
                  Upload images and get comprehensive AI analysis including
                  object detection, scene description, color analysis, and text
                  extraction.
                </p>
                <p className="text-center text-zinc-500 mt-0 my-6 max-w-2xl text-balance text-xl">
                  Powered by OpenAI's advanced vision models for accurate and
                  detailed image understanding.
                </p>

                <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                  <Button asChild size="lg">
                    <Link href="/analyze">
                      <span className="text-nowrap">Try Image Analysis</span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/upload">
                      <span className="text-nowrap">Upload Products</span>
                    </Link>
                  </Button>
                  <Button key={2} asChild size="lg" variant="outline">
                    <Link href="/dashboard">
                      <span className="text-nowrap">View Dashboard</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground font-medium">
                  Advanced AI Features
                </p>
                <div className="mt-4 flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">🔍</div>
                    <p className="text-sm text-gray-600">Object Detection</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">🎨</div>
                    <p className="text-sm text-gray-600">Color Analysis</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">📝</div>
                    <p className="text-sm text-gray-600">Text Extraction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">🌅</div>
                    <p className="text-sm text-gray-600">Scene Analysis</p>
                  </div>
                </div>
              </div>

              <div className="relative -mr-56 mt-16 sm:mr-0">
                <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                  <Image
                    src="https://cdn.prod.website-files.com/66ff08366f02f2c2ed616e96/6810a312f522d089df6c5973_6716d71c1624d43c1c1eb01e_matrix-p-2000%20(1).png"
                    alt="app screen"
                    width="2880"
                    height="1842"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
