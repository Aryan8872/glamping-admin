"use client";

import { useReducer, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createAdventure } from "../services/adventureService";

interface AddAdventureProps {
  onClose: () => void;
  onSuccess: () => void;
}

type State = {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  coverImageFile: File | null;
  bannerImageFile: File | null;
  title: string;
  pageDescription: string;
  isActive: boolean;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_COVER_IMAGE"; file: File; preview: string }
  | { type: "SET_BANNER_IMAGE"; file: File; preview: string }
  | { type: "REMOVE_COVER_IMAGE" }
  | { type: "REMOVE_BANNER_IMAGE" };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_COVER_IMAGE":
      return {
        ...state,
        coverImageFile: action.file,
        coverImage: action.preview,
      };
    case "SET_BANNER_IMAGE":
      return {
        ...state,
        bannerImageFile: action.file,
        bannerImage: action.preview,
      };
    case "REMOVE_COVER_IMAGE":
      return { ...state, coverImageFile: null, coverImage: "" };
    case "REMOVE_BANNER_IMAGE":
      return { ...state, bannerImageFile: null, bannerImage: "" };
    default:
      return state;
  }
}

export default function AddAdventure({
  onClose,
  onSuccess,
}: AddAdventureProps) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, dispatch] = useReducer(formReducer, {
    name: "",
    slug: "",
    description: "",
    coverImage: "",
    bannerImage: "",
    coverImageFile: null,
    bannerImageFile: null,
    title: "",
    pageDescription: "",
    isActive: true,
  });

  const generateSlug = () => {
    const slug = state.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    dispatch({ type: "SET_FIELD", field: "slug", value: slug });
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      dispatch({ type: "SET_COVER_IMAGE", file, preview });
    }
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      dispatch({ type: "SET_BANNER_IMAGE", file, preview });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("slug", state.slug);
      formData.append("description", state.description);
      formData.append("title", state.title);
      formData.append("pageDescription", state.pageDescription);
      formData.append("isActive", state.isActive.toString());

      // Append image files with the correct field names
      if (state.coverImageFile) {
        formData.append("adventureCoverImage", state.coverImageFile);
      }
      if (state.bannerImageFile) {
        formData.append("adventureBannerImage", state.bannerImageFile);
      }

      await createAdventure(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create adventure:", error);
      alert("Failed to create adventure");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[700px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New Adventure
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
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "name",
                    value: e.target.value,
                  })
                }
                onBlur={generateSlug}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., Romantic Stays"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., romantic-stays"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Short description for the card"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {state.coverImage ? (
                <div className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={state.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_COVER_IMAGE" })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IoClose />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverImageInputRef.current?.click()}
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg aspect-video flex flex-col justify-center items-center transition-colors"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                    Upload Cover Image
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={coverImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverImageUpload}
                required={!state.coverImage}
              />
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image <span className="text-red-500">*</span>
              </label>
              {state.bannerImage ? (
                <div className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={state.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_BANNER_IMAGE" })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IoClose />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => bannerImageInputRef.current?.click()}
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg aspect-video flex flex-col justify-center items-center transition-colors"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                    Upload Banner Image
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={bannerImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBannerImageUpload}
                required={!state.bannerImage}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Title <span className="text-red-500">*</span>
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
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Title for the adventure page"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={state.pageDescription}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "pageDescription",
                    value: e.target.value,
                  })
                }
                required
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Detailed description for the adventure page"
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
            text={isSubmitting ? "Creating..." : "Create Adventure"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
