"use client";

import { toast } from "react-toastify";

import { useReducer, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createAdventure } from "../services/adventureService";
import { useFormValidation } from "@/hooks/useFormValidation";
import { adventureSchema } from "@/lib/validation/adventureValidation";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";

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
  const [generalError, setGeneralError] = useState("");
  const {
    errors,
    setErrors,
    clearAllErrors,
    checkField,
    clearFieldError,
    setFieldError,
  } = useFormValidation();

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

  const handleFieldChange = (field: keyof State, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
    // Dynamically check if field exists in schema
    if (field in adventureSchema.shape) {
      checkField(
        field,
        value,
        adventureSchema.shape[field as keyof typeof adventureSchema.shape],
      );
    }
  };

  const generateSlug = () => {
    const slug = state.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    dispatch({ type: "SET_FIELD", field: "slug", value: slug });
    checkField("slug", slug, adventureSchema.shape.slug);
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

    // Client-side validation
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

    if (!state.coverImage) {
      setGeneralError("Cover image is required");
      setIsSubmitting(false);
      return;
    }

    if (!state.bannerImage) {
      setGeneralError("Banner image is required");
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

      if (state.coverImageFile) {
        formData.append("adventureCoverImage", state.coverImageFile);
      }
      if (state.bannerImageFile) {
        formData.append("adventureBannerImage", state.bannerImageFile);
      }

      await createAdventure(formData);
      toast.success("Adventure created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to create adventure:", error);
      if (error.body?.errors) {
        setErrors(error.body.errors);
      } else {
        setGeneralError(error.message || "Failed to create adventure");
      }
      // alert("Failed to create adventure"); // Removing generic alert for better UX
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
                onBlur={generateSlug}
                placeholder="e.g., Romantic Stays"
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
                placeholder="e.g., romantic-stays"
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
                placeholder="Short description for the card"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {state.coverImage ? (
                <div className="relative group aspect-video rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={state.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_COVER_IMAGE" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverImageInputRef.current?.click()}
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl aspect-video flex flex-col justify-center items-center transition-colors bg-gray-50 hover:bg-white"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 text-center">
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
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Banner Image <span className="text-red-500">*</span>
              </label>
              {state.bannerImage ? (
                <div className="relative group aspect-video rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={state.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_BANNER_IMAGE" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => bannerImageInputRef.current?.click()}
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl aspect-video flex flex-col justify-center items-center transition-colors bg-gray-50 hover:bg-white"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 text-center">
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
                placeholder="Title for the adventure page"
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
                placeholder="Detailed description for the adventure page"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={state.isActive}
                  onChange={(e) =>
                    handleFieldChange("isActive", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-gray-700">
                  Active Status
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
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
