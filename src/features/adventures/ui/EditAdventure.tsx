"use client";

import { toast } from "react-toastify";

import { useReducer, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { Adventure } from "../types/adventureTypes";
import { updateAdventure } from "../services/adventureService";
import { buildImageUrl } from "@/lib/http/http";
import { useFormValidation } from "@/hooks/useFormValidation";
import { adventureSchema } from "@/lib/validation/adventureValidation";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";

interface EditAdventureProps {
  adventure: Adventure;
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

export default function EditAdventure({
  adventure,
  onClose,
  onSuccess,
}: EditAdventureProps) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const {
    errors,
    setErrors,
    clearAllErrors,
    checkField,
    setFieldError,
    clearFieldError,
  } = useFormValidation();

  const [state, dispatch] = useReducer(formReducer, {
    name: adventure.name,
    slug: adventure.slug,
    description: adventure.description,
    coverImage: adventure.coverImage,
    bannerImage: adventure.bannerImage,
    coverImageFile: null,
    bannerImageFile: null,
    title: adventure.title,
    pageDescription: adventure.pageDescription,
    isActive: adventure.isActive,
  });

  const handleFieldChange = (field: keyof State, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
    if (field in adventureSchema.shape) {
      checkField(
        field,
        value,
        adventureSchema.shape[field as keyof typeof adventureSchema.shape],
      );
    }
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
    setGeneralError("");
    clearAllErrors();

    // Validation
    const result = adventureSchema.safeParse({
      name: state.name,
      slug: state.slug,
      description: state.description,
      title: state.title,
      pageDescription: state.pageDescription,
      isActive: state.isActive,
    });

    if (!result.success) {
      const fieldErrors = result.error.issues.map((e) => ({
        field: e.path[0] as string,
        message: e.message,
      }));
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("slug", state.slug);
      formData.append("description", state.description);
      formData.append("title", state.title);
      formData.append("pageDescription", state.pageDescription);
      formData.append("isActive", state.isActive.toString());

      // Append new image files if they exist
      if (state.coverImageFile) {
        formData.append("adventureCoverImage", state.coverImageFile);
      } else {
        formData.append("coverImage", state.coverImage);
      }

      if (state.bannerImageFile) {
        formData.append("adventureBannerImage", state.bannerImageFile);
      } else {
        formData.append("bannerImage", state.bannerImage);
      }

      await updateAdventure(adventure.id, formData);
      toast.success("Adventure updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to update adventure:", error);
      if (error.body?.errors) {
        setErrors(error.body.errors);
      } else {
        setGeneralError(error.message || "Failed to update adventure");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("blob:")) {
      return imagePath;
    }
    return buildImageUrl(imagePath);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[700px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Adventure
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        {generalError && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl animate-pulse">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormInput
                label="Name"
                required
                value={state.name}
                error={errors.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() =>
                  checkField("name", state.name, adventureSchema.shape.name)
                }
              />
            </div>

            <div className="col-span-2">
              <FormInput
                label="Slug"
                required
                value={state.slug}
                error={errors.slug}
                onChange={(e) => handleFieldChange("slug", e.target.value)}
                onBlur={() =>
                  checkField("slug", state.slug, adventureSchema.shape.slug)
                }
              />
            </div>

            <div className="col-span-2">
              <FormTextarea
                label="Description"
                required
                value={state.description}
                error={errors.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                onBlur={() =>
                  checkField(
                    "description",
                    state.description,
                    adventureSchema.shape.description,
                  )
                }
                rows={2}
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
                    src={getImageUrl(state.coverImage)}
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
                    src={getImageUrl(state.bannerImage)}
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
              />
            </div>

            <div className="col-span-2">
              <FormInput
                label="Page Title"
                required
                value={state.title}
                error={errors.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={() =>
                  checkField("title", state.title, adventureSchema.shape.title)
                }
              />
            </div>

            <div className="col-span-2">
              <FormTextarea
                label="Page Description"
                required
                value={state.pageDescription}
                error={errors.pageDescription}
                onChange={(e) =>
                  handleFieldChange("pageDescription", e.target.value)
                }
                onBlur={() =>
                  checkField(
                    "pageDescription",
                    state.pageDescription,
                    adventureSchema.shape.pageDescription,
                  )
                }
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.isActive}
                  onChange={(e) =>
                    handleFieldChange("isActive", e.target.checked)
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
            text={isSubmitting ? "Updating..." : "Update Adventure"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
