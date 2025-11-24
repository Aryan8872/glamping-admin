"use client";
import { useReducer, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { CampSchema, CampFormValues } from "../types/campTypes";
import { motion } from "framer-motion";

const MAX_CAMP_IMAGES = 10;

type State = {
  name: string;
  description: string;
  pricePerNight: string;
  images: string[];
  newImagesForBackend: File[];
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_IMAGE"; image: string }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "ADD_NEW_IMAGE"; image: File }
  | { type: "RESET"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_IMAGE":
      return { ...state, images: [...state.images, action.image] };
    case "REMOVE_IMAGE":
      const newImages = [...state.images];
      const newBackendImages = [...state.newImagesForBackend];
      // Note: This logic assumes newImagesForBackend aligns with images indices for NEW images.
      // For mixed (existing + new), we need careful handling.
      // Ideally, we should track which image is which.
      // But for simplicity in this shared form, we might need to handle removal differently.
      // Let's stick to the AddGallery logic for now, but refine it for Edit.
      newImages.splice(action.index, 1);
      // Only remove from backend array if it was a new image?
      // Actually, for Edit, we need to track removed existing images separately.
      // This reducer might be too simple for shared logic if we don't separate concerns.
      // Let's keep it simple: The parent handles the "save" logic.
      // The form just manages the current UI state.
      return {
        ...state,
        images: newImages,
        // We can't easily sync newImagesForBackend by index here if we mix them.
        // Better approach: Store objects { url: string, file?: File }
      };
    case "ADD_NEW_IMAGE":
      return {
        ...state,
        newImagesForBackend: [...state.newImagesForBackend, action.image],
      };
    case "RESET":
        return action.state;
    default:
      return state;
  }
}

// Improved State for Form
type FormState = {
    name: string;
    description: string;
    pricePerNight: string;
    images: { id: string; url: string; file?: File }[]; // id can be url or random
    removedImages: string[]; // URLs of removed existing images
}

type FormAction = 
    | { type: "SET_FIELD"; field: keyof FormState; value: any }
    | { type: "ADD_IMAGES"; images: { id: string; url: string; file: File }[] }
    | { type: "REMOVE_IMAGE"; id: string };

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "ADD_IMAGES":
            return { ...state, images: [...state.images, ...action.images] };
        case "REMOVE_IMAGE":
            const imgToRemove = state.images.find(i => i.id === action.id);
            if (!imgToRemove) return state;
            
            const isExisting = !imgToRemove.file;
            return {
                ...state,
                images: state.images.filter(i => i.id !== action.id),
                removedImages: isExisting ? [...state.removedImages, imgToRemove.url] : state.removedImages
            };
        default:
            return state;
    }
}

interface CampFormProps {
  initialData?: {
    name: string;
    description: string;
    pricePerNight: number;
    images: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function CampForm({ initialData, onSubmit, onCancel, submitLabel }: CampFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, dispatch] = useReducer(formReducer, {
    name: initialData?.name || "",
    description: initialData?.description || "",
    pricePerNight: initialData?.pricePerNight.toString() || "",
    images: initialData?.images.map(url => ({ id: url, url })) || [],
    removedImages: []
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_CAMP_IMAGES - state.images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    const newImages = selectedFiles.map(file => ({
        id: URL.createObjectURL(file), // Use blob URL as ID for new images
        url: URL.createObjectURL(file),
        file
    }));

    dispatch({ type: "ADD_IMAGES", images: newImages });
  };

  const handleSubmit = async () => {
    // Validation
    const result = CampSchema.safeParse({
        name: state.name,
        description: state.description,
        pricePerNight: state.pricePerNight
    });

    if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
    }

    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("name", state.name);
        formData.append("description", state.description);
        formData.append("pricePerNight", state.pricePerNight);
        
        // Append new images
        state.images.forEach(img => {
            if (img.file) {
                formData.append("images", img.file);
            }
        });

        // Append removed images (for Edit)
        if (state.removedImages.length > 0) {
            formData.append("removedImages", JSON.stringify(state.removedImages));
        }

        // Also need to send the list of *kept* existing images if the backend replaces the list?
        // Based on EditGallery logic:
        // const pureExistingImages = state.images.filter(...)
        // formData.append("images", JSON.stringify(pureExistingImages));
        
        const existingImages = state.images.filter(img => !img.file).map(img => img.url);
        // We append existing images as a JSON string if the backend expects it to reconcile
        // Or if the backend only adds new ones and removes specific ones, we might not need this.
        // But EditGallery did: formData.append("images", JSON.stringify(pureExistingImages));
        // So we should probably do that too.
        // Wait, "images" key is used for both Files and JSON string? That might be confusing for backend.
        // EditGallery: formData.append("images", JSON.stringify(pureExistingImages)); AND formData.append("galleryImage", file);
        // My CampApi might expect "images" for files.
        // Let's use "existingImages" key for the JSON list to be safe, or check backend logic.
        // Since I don't see backend, I'll follow EditGallery pattern but maybe use a different key if "images" is taken by files.
        // EditGallery used "galleryImage" for files and "images" for the list.
        // I'll use "images" for files (as per my previous AddCamp) and "existingImages" for the list.
        
        formData.append("existingImages", JSON.stringify(existingImages));

        await onSubmit(formData);
    } catch (error) {
        console.error(error);
        alert("An error occurred");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Camp Details Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Camp Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Camp Name</label>
            <input
              value={state.name}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
              className={`focus:outline-none focus:ring-2 focus:ring-blue-500 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 text-gray-700`}
              placeholder="Enter camp name"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Price Per Night</label>
            <input
              type="number"
              value={state.pricePerNight}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "pricePerNight", value: e.target.value })}
              className={`focus:outline-none focus:ring-2 focus:ring-blue-500 border ${errors.pricePerNight ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 text-gray-700`}
              placeholder="Enter price"
            />
            {errors.pricePerNight && <span className="text-xs text-red-500">{errors.pricePerNight}</span>}
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={state.description}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })}
              className={`resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 text-gray-700`}
              placeholder="Enter description"
            />
            {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Camp Images Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Camp Images</h3>
        <div className="grid grid-cols-4 gap-4">
          {state.images.map((img, idx) => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <motion.img
                src={img.file ? img.url : `${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${img.url}`}
                alt={`Camp ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => dispatch({ type: "REMOVE_IMAGE", id: img.id })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoClose />
              </button>
            </div>
          ))}

          {state.images.length < MAX_CAMP_IMAGES && (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg aspect-square flex flex-col justify-center items-center transition-colors"
            >
              <BiPlus
                className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                size={32}
              />
              <span className="text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors text-center px-2">
                Upload Images
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </section>

      {/* Footer Actions */}
      <div className="flex flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <div>
          <SecondaryButton text="Cancel" onClick={onCancel} />
        </div>
        <div>
          <PrimaryFilledButton text={isSubmitting ? "Saving..." : submitLabel} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
