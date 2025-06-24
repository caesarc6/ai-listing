import React from "react";

export interface ListingCardProps {
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function ListingCard({
  imageUrl,
  title,
  description,
  createdAt,
}: ListingCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded shadow-sm">
      <img
        src={imageUrl}
        alt={title}
        className="w-full sm:w-32 h-32 object-cover rounded border"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600 mb-2 line-clamp-3">{description}</p>
        </div>
        <span className="text-xs text-gray-400 mt-2">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
