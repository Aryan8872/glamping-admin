"use client";

import { useReducer, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createExperience } from "../services/experienceService";

interface AddExperienceProps {
  onClose: () => void;
  onSuccess: () => void;
}

type State = {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  isActive: boolean;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_IMAGE"; file: File; preview: string }
  | { type: "REMOVE_IMAGE" };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGE":
      return { ...state, imageFile: action.file, imageUrl: action.preview };
    case "REMOVE_IMAGE":
      return { ...state, imageFile: null, imageUrl: "" };
    default:
      return state;
  }
}

export default function AddExperience({
  onClose,
  onSuccess,
}: AddExperienceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, dispatch] = useReducer(formReducer, {
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    isActive: true,
  });

  const generateSlug = () => {
    const slug = state.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    dispatch({ type: "SET_FIELD", field: "slug", value: slug });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      dispatch({ type: "SET_IMAGE", file, preview });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("slug", state.slug);
      formData.append("description", state.description);
      formData.append("isActive", state.isActive.toString());

      if (state.imageFile) {
        formData.append("imageUrl", state.imageFile);
      }

      await createExperience(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create experience:", error);
      alert("Failed to create experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New Experience
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "title",
                    value: e.target.value,
                  })
                }
                onBlur={generateSlug}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Mountain"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.slug}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "slug",
                    value: e.target.value,
                  })
                }
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., mountain"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "description",
                    value: e.target.value,
                  })
                }
                required
                rows={2}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Short description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {state.imageUrl ? (
                <div className="relative group aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img
                    src={state.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_IMAGE" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg aspect-video w-full flex flex-col justify-center items-center transition-colors bg-gray-50 hover:bg-white"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 text-center">
                    Upload Cover Image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Supports SVG, PNG, JPG
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                required={!state.imageUrl}
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.isActive}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "isActive",
                      value: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <SecondaryButton text="Cancel" onClick={onClose} />
          <PrimaryFilledButton
            text={isSubmitting ? "Creating..." : "Create Experience"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
