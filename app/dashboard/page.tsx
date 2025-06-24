"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ListingCard from "@/components/ListingCard";
import { HeroHeader } from "@/components/header";

export default function DashboardPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Current user:", user);
      if (!user) {
        router.replace("/");
        return;
      }
      const { data, error } = await supabase
        .from("listings")
        .select("id, image_url, title, description, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    };
    fetchListings();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <HeroHeader />
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <HeroHeader />
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <>
      <HeroHeader />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Product Listings</h1>
        {listings.length === 0 ? (
          <div className="text-gray-500">
            No listings found. Upload a product to get started!
          </div>
        ) : (
          <div className="space-y-6">
            {listings.map((listing, idx) => (
              <div key={listing.id}>
                <ListingCard
                  imageUrl={listing.image_url}
                  title={listing.title}
                  description={listing.description}
                  createdAt={listing.created_at}
                />
                {idx !== listings.length - 1 && (
                  <hr className="my-6 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
