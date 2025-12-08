"use client";
import { useReducer, useRef } from "react";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { EnumDropdown } from "@/components/EnumDropdown";
import { enumToOptions } from "@/utils/enumToOptions";
import {
  GALLERY_STATUS,
  Gallery,
  MAX_GALLERY_IMAGES,
} from "../types/galleryTypes";
import { motion } from "framer-motion";

type State = {
  title: string;
  description: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageAlt: string;
  galleryStatus: GALLERY_STATUS;
  images: string[];
  newImages: File[];
  coverImage: File | null;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_IMAGE"; image: string }
  | { type: "REMOVE_IMAGE"; image: string }
  | { type: "ADD_NEW_IMAGE"; image: File }
  | { type: "SET_COVER_IMAGE"; image: File }
  | { type: "SET_STATUS"; status: GALLERY_STATUS };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_IMAGE":
      return { ...state, images: [...state.images, action.image] };
    case "REMOVE_IMAGE":
      return {
        ...state,
        images: state.images.filter((img) => img !== action.image),
      };
    case "ADD_NEW_IMAGE":
      return {
        ...state,
        newImages: [...state.newImages, action.image],
      };
    case "SET_COVER_IMAGE":
      return { ...state, coverImage: action.image };
    case "SET_STATUS":
      return { ...state, galleryStatus: action.status };
    default:
      return state;
  }
}

interface GalleryFormProps {
  initialData?: Gallery;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function GalleryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: GalleryFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(formReducer, {
    title: initialData?.title || "",
    description: initialData?.description || "",
    excerpt: initialData?.excerpt || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
    imageAlt: initialData?.imageAlt || "",
    galleryStatus: initialData?.galleryStatus || GALLERY_STATUS.DRAFT,
    images: initialData?.images || [],
    newImages: [],
    coverImage: null,
  });

  const statusOptions = enumToOptions(GALLERY_STATUS);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_GALLERY_IMAGES - state.images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      dispatch({ type: "ADD_NEW_IMAGE", image: file });
      const url = URL.createObjectURL(file);
      dispatch({ type: "ADD_IMAGE", image: url });
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({ type: "SET_COVER_IMAGE", image: file });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Text fields
    formData.append("title", state.title);
    formData.append("description", state.description);
    formData.append("excerpt", state.excerpt);
    formData.append("metaTitle", state.metaTitle);
    formData.append("metaDescription", state.metaDescription);
    formData.append("metaKeywords", state.metaKeywords);
    formData.append("imageAlt", state.imageAlt);
    formData.append("galleryStatus", state.galleryStatus);

    // Handle existing images
    const pureExistingImages = state.images.filter(
      (img) => typeof img === "string" && !img.startsWith("blob:")
    );
    const removedImages = initialData?.images.filter(
      (img) => !pureExistingImages.includes(img)
    );
    if (removedImages) {
      formData.append("removedImages", JSON.stringify(removedImages));
    }
    formData.append("images", JSON.stringify(pureExistingImages));

    // New gallery images
    if (Array.isArray(state.newImages)) {
      state.newImages.forEach((file) => {
        if (file instanceof File) {
          formData.append("galleryImage", file);
        }
      });
    }

    // Cover image
    if (state.coverImage instanceof File) {
      formData.append("coverImage", state.coverImage);
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      {/* Cover Image Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cover Image
        </h3>
        <div
          onClick={() => coverImageRef.current?.click()}
          className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg h-40 w-full flex flex-col justify-center items-center transition-colors"
        >
          {state.coverImage ? (
            <div className="w-full h-full relative">
              <img
                src={URL.createObjectURL(state.coverImage)}
                alt="cover preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : initialData?.coverImage ? (
            <div className="w-full h-full relative">
              <img
                src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${initialData.coverImage}`}
                alt="cover"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <>
              <BiPlus
                className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                size={32}
              />
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                Upload Cover Image
              </span>
            </>
          )}
        </div>
        <input
          type="file"
          onChange={handleCoverImageChange}
          ref={coverImageRef}
          className="hidden"
          accept="image/*"
        />
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Gallery Details Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gallery Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Gallery Title
            </label>
            <input
              value={state.title}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "title",
                  value: e.target.value,
                })
              }
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Gallery Excerpt
            </label>
            <input
              value={state.excerpt}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "excerpt",
                  value: e.target.value,
                })
              }
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter excerpt"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Image Alt Text
            </label>
            <input
              value={state.imageAlt}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "imageAlt",
                  value: e.target.value,
                })
              }
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter alt text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Gallery Status
            </label>
            <EnumDropdown
              value={state.galleryStatus}
              onChange={(value) =>
                dispatch({
                  type: "SET_STATUS",
                  status: value as GALLERY_STATUS,
                })
              }
              options={statusOptions}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Gallery Description
            </label>
            <textarea
              rows={4}
              value={state.description}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter description"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Meta Fields Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Meta Fields
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              value={state.metaTitle}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaTitle",
                  value: e.target.value,
                })
              }
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter meta title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Meta Keywords
            </label>
            <input
              value={state.metaKeywords}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaKeywords",
                  value: e.target.value,
                })
              }
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter keywords"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={state.metaDescription}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaDescription",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
              placeholder="Enter meta description"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Gallery Images Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gallery Images
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {state.images.map((img, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <motion.img
                src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${img}`}
                alt={`Gallery ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => dispatch({ type: "REMOVE_IMAGE", image: img })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoClose />
              </button>
            </div>
          ))}

          {state.images.length < MAX_GALLERY_IMAGES && (
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
          <PrimaryFilledButton text={submitLabel} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
