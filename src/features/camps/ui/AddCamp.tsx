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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-[700px] overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 z-30 flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Camp
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Add a new campsite to your portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all group active:scale-95"
            aria-label="Close modal"
          >
            <CgClose className="text-slate-400 group-hover:text-slate-900 transition-colors text-2xl sm:text-3xl" />
          </button>
        </div>

        <div className="p-0 overflow-y-auto">
          <div className="p-6">
            <CampForm
              onSubmit={handleSave}
              onCancel={onClose}
              submitLabel="Save Camp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
