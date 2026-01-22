"use client";

import { getGalleryList } from "@/features/gallery/services/galleryService";
import GalleryGrid from "@/features/gallery/ui/GalleryGrid";
import GalleryHeader from "@/features/gallery/ui/GalleryHeader";
import { useSearch } from "@/hooks/useSearch";
import { Gallery } from "@/features/gallery/types/galleryTypes";
import { BiSearch } from "react-icons/bi";

export default function GalleryPage() {
  const {
    data: galleryData,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    refresh,
  } = useSearch<Gallery>({
    fetchFn: getGalleryList,
    perPage: 12,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <GalleryHeader onRefresh={refresh} />

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <BiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search galleries..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
        />
      </div>

      <GalleryGrid
        galleryData={galleryData}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalResults={total}
      />
    </div>
  );
}
