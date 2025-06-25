"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ListingCard from "@/components/ListingCard";
import { HeroHeader } from "@/components/header";

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const handleCardClick = (listing: any) => {
    setSelected(listing);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) {
      setListings((listings) => listings.filter((l) => l.id !== id));
      setModalOpen(false);
      setSelected(null);
    } else {
      alert("Failed to delete listing: " + error.message);
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <>
        <HeroHeader />
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeroHeader />
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeroHeader />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold  my-6">Your Product Listings</h1>
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
                  onClick={() => handleCardClick(listing)}
                  onDelete={() => handleDelete(listing.id)}
                />
                {idx !== listings.length - 1 && (
                  <hr className="my-6 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Modal open={modalOpen && !!selected} onClose={() => setModalOpen(false)}>
        {selected && (
          <div>
            <img
              src={selected.image_url}
              alt={selected.title}
              className="w-full h-64 object-cover rounded mb-4 border"
            />
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            <p className="mb-4 text-gray-700 whitespace-pre-line">
              {selected.description}
            </p>
            <div className="text-xs text-gray-400 mb-4">
              Created: {new Date(selected.created_at).toLocaleString()}
            </div>
            <button
              onClick={() => handleDelete(selected.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Listing"}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
