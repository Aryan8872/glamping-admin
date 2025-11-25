import { CgClose } from "react-icons/cg";
import { BiPlus } from "react-icons/bi";
import { useReducer, useRef, useState } from "react";
import { EnumDropdown } from "@/components/EnumDropdown";
import { GALLERY_STATUS, GalleryTextField } from "../types/galleryTypes";
import { createGallery } from "../services/galleryService";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import { enumToOptions } from "@/utils/enumToOptions";
import SecondaryButton from "@/components/SecondaryButton";

// Mock components
// const EnumDropdown = ({ options, onChange }: any) => (
//   <select
//     onChange={onChange}
//     className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2 text-gray-700 bg-white"
//   >
//     {options.map((opt: any) => (
//       <option key={opt.value} value={opt.value}>{opt.label}</option>
//     ))}
//   </select>
// );

const statusDropdownOptions = enumToOptions(GALLERY_STATUS);

type State = {
  title: string;
  description: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageAlt: string;
  galleryStatus: GALLERY_STATUS;
  galleryImage: File[];
  coverImage: File | null;
};

type Action =
  | { type: "ADD_COVER_IMAGE"; img: File }
  | { type: "ADD_GALLERY_IMAGES"; img: File[] }
  | { type: "ADD_FIELD"; field: string; value: string }
  | { type: "SET_STATUS"; status: GALLERY_STATUS };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_COVER_IMAGE":
      return { ...state, coverImage: action.img };
    case "SET_STATUS":
      return { ...state, galleryStatus: action.status };
    case "ADD_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_GALLERY_IMAGES":
      return { ...state, galleryImage: action.img };
    default:
      return state;
  }
};
export default function AddGallery({ onClose }: { onClose: () => void }) {
  const coverImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [campSitePreviewImage, setCampSitePreviewImages] = useState([""]);
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    description: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    imageAlt: "",
    galleryStatus: GALLERY_STATUS.DRAFT,
    galleryImage: [],
    coverImage: null,
  });

  const handleCoverImageUplaod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coverImage = e.target.files?.[0];
    if (coverImage) {
      const encodedurl = URL.createObjectURL(coverImage);
      setCoverImagePreview(encodedurl);
      dispatch({ type: "ADD_COVER_IMAGE", img: coverImage });
    }
  };

  const handleGalleryImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const images = e.target.files;
    if (images) {
      const encodedurls = Array.from(images).map((image) =>
        URL.createObjectURL(image)
      );
      setCampSitePreviewImages(encodedurls);
      dispatch({ type: "ADD_GALLERY_IMAGES", img: Array.from(images) });
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    const texFields: GalleryTextField[] = [
      "title",
      "description",
      "excerpt",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "imageAlt",
    ];

    texFields.forEach((field) => {
      formData.append(field, state[field]);
      console.log("state data",state[field])
    });

    state.coverImage && formData.append("coverImage", state.coverImage);
    state.galleryImage.forEach((image) => {
      formData.append("galleryImage", image);
    });
    state.galleryStatus &&
      formData.append("galleryStatus", state.galleryStatus);

    try {
      const res = await createGallery(formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[90]">
      <div className="relative w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create Gallery
          </h2>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <CgClose className="text-gray-500 text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Cover Image Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cover Image
            </h3>
            <div
              onClick={() => coverImageRef.current?.click()}
              className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg h-40 w-full flex flex-col justify-center items-center transition-colors"
            >
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
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
              onChange={handleCoverImageUplaod}
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
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                x
                <EnumDropdown
                  value={state.galleryStatus}
                  onChange={(value) => {
                    dispatch({
                      type: "SET_STATUS",
                      status: value as GALLERY_STATUS,
                    });
                  }}
                  options={statusDropdownOptions}
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Gallery Description
                </label>
                <textarea
                  rows={4}
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_FIELD",
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
            <div
              onClick={() => galleryImagesRef.current?.click()}
              className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg h-40 w-full flex flex-col justify-center items-center transition-colors"
            >
              <BiPlus
                className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                size={32}
              />
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                Upload Gallery Images
              </span>
            </div>
            <input
              type="file"
              onChange={handleGalleryImagesUpload}
              ref={galleryImagesRef}
              className="hidden"
              accept="image/*"
              multiple
            />
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl">
          <SecondaryButton onClick={onClose} text="Cancel" />
          <PrimaryFilledButton
            onClick={() => handleSave()}
            text="Save Gallery"
          />
        </div>
      </div>
    </div>
  );
}
