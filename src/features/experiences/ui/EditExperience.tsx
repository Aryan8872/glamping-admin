"use client";

import { toast } from "react-toastify";

import { useReducer, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { updateExperience } from "../services/experienceService";
import { Experience } from "../types/experienceTypes";
import { buildImageUrl, buildUrl } from "@/lib/http/http";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";

interface EditExperienceProps {
  experience: Experience;
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
  | { type: "REMOVE_IMAGE" }
  | { type: "RESET"; payload: State };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGE":
      return { ...state, imageFile: action.file, imageUrl: action.preview };
    case "REMOVE_IMAGE":
      return { ...state, imageFile: null, imageUrl: "" };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

export default function EditExperience({
  experience,
  onClose,
  onSuccess,
}: EditExperienceProps) {
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

  useEffect(() => {
    if (experience) {
      dispatch({
        type: "RESET",
        payload: {
          title: experience.title,
          slug: experience.slug,
          description: experience.description || "",
          imageUrl: experience.imageUrl
            ? buildImageUrl(experience.imageUrl)
            : "",
          imageFile: null,
          isActive: experience.isActive,
        },
      });
    }
  }, [experience]);

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

      await updateExperience(experience.id, formData);
      toast.success("Experience updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update experience:", error);
      toast.error("Failed to update experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-[600px] max-w-full overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 z-30 flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Update the details of your experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all group active:scale-95"
            aria-label="Close modal"
          >
            <IoClose
              size={28}
              className="text-slate-400 group-hover:text-slate-900 transition-colors"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <FormInput
                label="Title"
                required
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "title",
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <FormInput
                label="Slug"
                required
                value={state.slug}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "slug",
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <FormTextarea
                label="Description"
                required
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "description",
                    value: e.target.value,
                  })
                }
                rows={6}
                className="min-h-[150px] sm:min-h-[200px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
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

        <div className="p-5 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/50">
          <div className="hidden sm:block">
            <SecondaryButton text="Cancel" onClick={onClose} />
          </div>
          <div className="w-full sm:w-auto">
            <PrimaryFilledButton
              text={isSubmitting ? "Updating..." : "Update Experience"}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
