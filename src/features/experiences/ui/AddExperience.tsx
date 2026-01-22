"use client";

import { toast } from "react-toastify";

import { useReducer, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createExperience } from "../services/experienceService";
import { useFormValidation } from "@/hooks/useFormValidation";
import { experienceSchema } from "@/lib/validation/experienceValidation";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";

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
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    isActive: true,
  });

  const handleFieldChange = (field: keyof State, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
    // Dynamically validate field if it exists in schema
    if (field in experienceSchema.shape) {
      checkField(
        field,
        value,
        experienceSchema.shape[field as keyof typeof experienceSchema.shape],
      );
    }
  };

  const generateSlug = () => {
    const slug = state.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    dispatch({ type: "SET_FIELD", field: "slug", value: slug });
    checkField("slug", slug, experienceSchema.shape.slug);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError("Image size must be less than 5MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      dispatch({ type: "SET_IMAGE", file, preview });
      setGeneralError(""); // Clear any previous image errors
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");
    clearAllErrors();

    // Client-side validation
    const result = experienceSchema.safeParse({
      title: state.title,
      slug: state.slug,
      description: state.description,
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

    if (!state.imageUrl) {
      setGeneralError("Cover image is required");
      setIsSubmitting(false);
      return;
    }

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
      toast.success("Experience created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to create experience:", error);
      if (error.body?.errors) {
        setErrors(error.body.errors);
      } else {
        setGeneralError(error.message || "Failed to create experience");
      }
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

        {generalError && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl animate-pulse">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormInput
                label="Title"
                required
                value={state.title}
                error={errors.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={generateSlug}
                placeholder="e.g., Mountain"
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
                  checkField("slug", state.slug, experienceSchema.shape.slug)
                }
                placeholder="e.g., mountain"
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
                    experienceSchema.shape.description,
                  )
                }
                rows={3}
                placeholder="Short description..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {state.imageUrl ? (
                <div className="relative group aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
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
                  className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl aspect-video w-full flex flex-col justify-center items-center transition-colors bg-gray-50 hover:bg-white"
                >
                  <BiPlus
                    className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                    size={32}
                  />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 text-center">
                    Upload Cover Image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Supports SVG, PNG, JPG (Max 5MB)
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
            text={isSubmitting ? "Creating..." : "Create Experience"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
