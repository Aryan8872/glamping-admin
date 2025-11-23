"use client";
import { PageHeading } from "@/components/PageHeading";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useRef, useReducer } from "react";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { EnumDropdown } from "@/components/EnumDropdown";
import { enumToOptions } from "@/utils/enumToOptions";
import { FaPlus } from "react-icons/fa6";
import {
  Gallery,
  GALLERY_STATUS,
  GalleryTextField,
  MAX_GALLERY_IMAGES,
} from "../types/galleryTypes";
import { updateGalleryStatus } from "../services/galleryService";

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
  newImagesForBackend: File[];
  coverImage: File | null;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_IMAGE"; image: string }
  | { type: "REMOVE_IMAGE"; image: string }
  | { type: "ADD_NEW_IMAGE"; image: File }
  | { type: "SET_COVER_IMAGE"; image: File }
  | { type: "SET_STATUS"; status: GALLERY_STATUS };

function reducer(state: State, action: Action): State {
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
        newImagesForBackend: [...state.newImagesForBackend, action.image],
      };
    case "SET_COVER_IMAGE":
      return { ...state, coverImage: action.image };
    case "SET_STATUS":
      return { ...state, galleryStatus: action.status };
    default:
      return state;
  }
}

export default function EditGallery({ galleryData }: { galleryData: Gallery }) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    title: galleryData.title,
    description: galleryData.description,
    excerpt: galleryData.excerpt,
    metaTitle: galleryData.metaTitle || "",
    metaDescription: galleryData.metaDescription || "",
    metaKeywords: galleryData.metaKeywords || "",
    imageAlt: galleryData.imageAlt || "",
    galleryStatus: galleryData.galleryStatus,
    images: [...galleryData.images],
    newImagesForBackend: [],
    coverImage: null,
  });

  const galleryStatusOptions = enumToOptions(GALLERY_STATUS);

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

  const handleRemoveImage = (img: string) => {
    dispatch({ type: "REMOVE_IMAGE", image: img });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) dispatch({ type: "SET_COVER_IMAGE", image: file });
  };

  const handleSave = async () => {
    const formData = new FormData();

    // -------------------------
    // 1. Append all text fields
    // -------------------------
    const textFields: GalleryTextField[] = [
      "title",
      "description",
      "excerpt",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "imageAlt",
      "galleryStatus",
    ];

    textFields.forEach((key) => {
      if (state[key] !== undefined) {
        formData.append(key, state[key]);
      }
    });

    // ---------------------------------------
    // 2. FIX: Separate actual existing DB images
    // ---------------------------------------
    const pureExistingImages = state.images.filter(
      (img) => typeof img === "string" && !img.startsWith("blob:")
    );

    // ---------------------------------------
    // 3. FIX: Calculate removed images correctly
    // ---------------------------------------
    const removedImages = galleryData.images.filter(
      (img) => !pureExistingImages.includes(img)
    );

    formData.append("removedImages", JSON.stringify(removedImages));
    formData.append("images", JSON.stringify(pureExistingImages));

    // ---------------------------------------
    // 4. FIX: Append new gallery images (File objects only)
    // ---------------------------------------
    if (Array.isArray(state.newImagesForBackend)) {
      state.newImagesForBackend.forEach((file) => {
        if (file instanceof File) {
          formData.append("galleryImage", file);
        }
      });
    }

    // ---------------------------------------
    // 5. Cover image (working fine already)
    // ---------------------------------------
    if (state.coverImage instanceof File) {
      formData.append("coverImage", state.coverImage);
    }

    // ---------------------------------------
    // 6. Final request
    // ---------------------------------------
    try {
      const update = await updateGalleryStatus(galleryData.slug, formData);
      console.log("Gallery updated:", update);
    } catch (err) {
      console.error("Error updating gallery:", err);
    }
  };

  return (
    <>
      <PageHeading heading="Edit Gallery" />
      <section className="page-padding">
        <div className="grid grid-cols-2 gap-x-7 gap-y-5 mt-7">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Gallery title</label>
            <input
              value={state.title}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "title",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Meta Title */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Meta title</label>
            <input
              value={state.metaTitle}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaTitle",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Cover Image</label>
            <input
              type="file"
              onChange={handleCoverImageChange}
              ref={coverImageRef}
            />
          </div>

          {/* Meta Keywords */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Meta Keywords</label>
            <input
              value={state.metaKeywords}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaKeywords",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Description</label>
            <textarea
              value={state.description}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
              rows={6}
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Meta Description */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Meta Description</label>
            <textarea
              value={state.metaDescription}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "metaDescription",
                  value: e.target.value,
                })
              }
              rows={6}
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Excerpt (short description)</label>
            <textarea
              value={state.excerpt}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "excerpt",
                  value: e.target.value,
                })
              }
              rows={6}
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Image Alt */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Image Alt</label>
            <input
              value={state.imageAlt}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "imageAlt",
                  value: e.target.value,
                })
              }
              className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
            />
          </div>

          {/* Gallery Status */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Gallery Status</label>
            <EnumDropdown
              options={galleryStatusOptions}
              value={state.galleryStatus}
              onChange={(val) =>
                dispatch({ type: "SET_STATUS", status: val as GALLERY_STATUS })
              }
            />
          </div>
        </div>

        {/* Images Grid */}
        <h1 className="font-semibold text-lg mt-3">Images</h1>
        <motion.div className="mt-3 grid lg:grid-cols-4 grid-cols-2 gap-4">
          {state.images.map((img, idx) => (
            <div key={idx} className="relative group">
              <motion.img
                src={`${process.env.RESOLVED_API_BASE_URL}${img}`}
                alt=""
                className="w-full h-full aspect-[2/2]"
              />
              <div
                className="hidden group-hover:block absolute top-3 right-3 rounded-full bg-red-500"
                onClick={() => handleRemoveImage(img)}
              >
                <IoClose color="white" className="text-lg" />
              </div>
            </div>
          ))}

          {state.images.length < MAX_GALLERY_IMAGES && (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="w-[80%] rounded-lg flex justify-center items-center g-full bg-primary-blue"
            >
              <div className="rounded-full cursor-pointer">
                <FaPlus color="white" className="text-3xl" />
              </div>
            </div>
          )}

          <input
            type="file"
            onChange={handleImageUpload}
            multiple
            ref={imageInputRef}
            className="hidden"
          />
        </motion.div>
      </section>

      <div className="w-full flex flex-row justify-end gap-3 mt-5">
        <div onClick={handleSave}>
          <PrimaryFilledButton text="Save" />
        </div>
        <div>
          <SecondaryButton text="Cancel" />
        </div>
      </div>
    </>
  );
}
