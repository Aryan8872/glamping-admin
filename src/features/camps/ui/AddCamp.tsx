"use client";
import { CgClose } from "react-icons/cg";
import { createCamp } from "../services/campService";
import CampForm from "./CampForm";
import { toast } from "react-toastify";

export default function AddCamp({ onClose }: { onClose: () => void }) {
  const handleSave = async (formData: FormData) => {
    try {
      await createCamp(formData);
      toast.success("Camp created successfully");
      onClose();
    } catch (err) {
      console.error("Error creating camp:", err);
      // Rethrow to let CampForm handle it (e.g., showing field errors)
      throw err;
    }
  };
  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[90]">
      <div className="relative w-full max-w-[650px] mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-2xl font-semibold text-gray-900">Create Camp</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CgClose className="text-gray-500 text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <CampForm
            onSubmit={handleSave}
            onCancel={onClose}
            submitLabel="Save Camp"
          />
        </div>
      </div>
    </div>
  );
}
