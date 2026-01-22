"use client";
import Link from "next/link";
import { Gallery, GALLERY_STATUS } from "../types/galleryTypes";
import { motion } from "framer-motion";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { MdDelete, MdEdit } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { useConfirm } from "@/stores/useConfirm";
import { deleteGallery } from "../services/galleryActions";
import { useRouter } from "next/navigation";
import { buildImageUrl, buildUrl } from "@/lib/http/http";
import { toast } from "react-toastify";

import Pagination from "@/components/Pagination";

export default function GalleryGrid({
  galleryData,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalResults = 0,
}: {
  galleryData: Gallery[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalResults?: number;
}) {
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25, delay: 0.45 } },
  };
  const gridSquareVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const confirm = useConfirm((s) => s.confirm);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const ok = await confirm("Are you sure you want to delete this gallery?");
    if (!ok) return;
    try {
      await deleteGallery(id);
      toast.success("Gallery deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery");
    }
  };

  return (
    <div className="min-h-[400px] relative">
      {isLoading && galleryData.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 font-medium">
            Loading galleries...
          </span>
        </div>
      ) : galleryData.length > 0 ? (
        <>
          <motion.section
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          >
            {galleryData.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <Link
                  href={`/gallery/${gallery.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden"
                >
                  <div
                    className={`${
                      (gallery.galleryStatus === GALLERY_STATUS.DELETED &&
                        "bg-red-500") ||
                      (gallery.galleryStatus === GALLERY_STATUS.DRAFT &&
                        "bg-blue-500") ||
                      (gallery.galleryStatus == GALLERY_STATUS.PUBLISHED &&
                        "bg-green-500")
                    } text-white rounded-full px-3 py-1 z-10 shadow-sm text-[10px] uppercase tracking-wider font-bold absolute top-3 right-3`}
                  >
                    {gallery.galleryStatus}
                  </div>
                  <motion.img
                    src={buildImageUrl(gallery.coverImage)}
                    alt={gallery.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white text-xs font-medium line-clamp-2">
                      {gallery.excerpt}
                    </p>
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {gallery.title}
                  </h3>

                  <div className="flex gap-2">
                    <Link href={`/gallery/${gallery.slug}`} className="flex-1">
                      <PrimaryFilledButton
                        text="Edit"
                        icon={<MdEdit className="text-lg" />}
                        onClick={() => {}}
                      />
                    </Link>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100 hover:border-red-100"
                      title="Delete Gallery"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.section>

          <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange || (() => {})}
              isLoading={isLoading}
              totalResults={totalResults}
              resultsOnPage={galleryData.length}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <BiSearch size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No galleries found
          </h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}
