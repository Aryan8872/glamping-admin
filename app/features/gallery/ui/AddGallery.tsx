import { CgClose } from "react-icons/cg";
import { BiPlus } from "react-icons/bi";
import { useRef, useState } from "react";

// Mock components
const EnumDropdown = ({ options, onChange }: any) => (
  <select 
    onChange={onChange}
    className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2 text-gray-700 bg-white"
  >
    {options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const PrimaryFilledButton = ({ text }: any) => (
  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
    {text}
  </button>
);

const SecondaryButton = ({ text }: any) => (
  <button className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
    {text}
  </button>
);

const statusDropdownOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' }
];

export default function AddGallery() {
  const coverImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-[90]">
      <div className="relative w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-2xl font-semibold text-gray-900">Create Gallery</h2>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <CgClose className="text-gray-500 text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Cover Image Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
            <div
              onClick={() => coverImageRef.current?.click()}
              className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg h-40 w-full flex flex-col justify-center items-center transition-colors"
            >
              <BiPlus className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" size={32} />
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                Upload Cover Image
              </span>
            </div>
            <input 
              type="file" 
              ref={coverImageRef} 
              className="hidden" 
              accept="image/*"
            />
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Gallery Details Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Details</h3>
            <div className="grid grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Gallery Title</label>
                <input
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter title"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Gallery Excerpt</label>
                <input
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter excerpt"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Image Alt Text</label>
                <input
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter alt text"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Gallery Status</label>
                <EnumDropdown onChange={() => {}} options={statusDropdownOptions} />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Gallery Description</label>
                <textarea
                  rows={4}
                  className="resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Meta Fields Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Fields</h3>
            <div className="grid grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Meta Title</label>
                <input
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter meta title"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
                <input
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter keywords"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Meta Description</label>
                <textarea
                  rows={3}
                  className="resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                  placeholder="Enter meta description"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Gallery Images Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images</h3>
            <div
              onClick={() => galleryImagesRef.current?.click()}
              className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg h-40 w-full flex flex-col justify-center items-center transition-colors"
            >
              <BiPlus className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" size={32} />
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                Upload Gallery Images
              </span>
            </div>
            <input 
              type="file" 
              ref={galleryImagesRef} 
              className="hidden" 
              accept="image/*"
              multiple
            />
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl">
          <SecondaryButton text="Cancel" />
          <PrimaryFilledButton text="Save Gallery" />
        </div>
      </div>
    </div>
  );
}