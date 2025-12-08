"use client";
import { CgClose } from "react-icons/cg";
import { createGallery } from "../services/galleryActions";
import GalleryForm from "./GalleryForm";

export default function AddGalleryModal({ onClose }: { onClose: () => void }) {
  const handleSave = async (formData: FormData) => {
    try {
      await createGallery(formData);
      onClose();
    } catch (err) {
      console.error("Error creating gallery:", err);
      alert("Failed to create gallery");
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[90]">
      <div className="relative w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create Gallery
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CgClose className="text-gray-500 text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <GalleryForm
            onSubmit={handleSave}
            onCancel={onClose}
            submitLabel="Save Gallery"
          />
        </div>
      </div>
    </div>
  );
}
