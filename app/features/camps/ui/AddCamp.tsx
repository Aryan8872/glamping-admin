"use client";
import { CgClose } from "react-icons/cg";
import { createCamp } from "../services/campService";
import CampForm from "./CampForm";
import { useReducer } from "react";

type State = {
  name: string;
  description: string;
  images: File[];
  pricePerNight: number;
};
type TextFields = ["name", "description", "pricePerNight"];
type Action =
  | { type: "ADD_FIELD"; field: string; value: string }
  | { type: "ADD_IMAGES"; img: File[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_IMAGES":
      return { ...state, images: action.img };
    case "ADD_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};
export default function AddCamp({ onClose }: { onClose: () => void }) {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    description: "",
    images: [],
    pricePerNight: 0,
  });
  const handleSave = async (formData: FormData) => {
    try {
      await createCamp(formData);
      onClose();
    } catch (err) {
      console.error("Error creating camp:", err);
      alert("Failed to create camp");
    }
  };
  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[90]">
      <div className="relative w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
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
