"use client";
import { PageHeading } from "@/components/PageHeading";
import { Gallery } from "../types/galleryTypes";
import { updateGallery } from "../services/galleryActions";
import GalleryForm from "./GalleryForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditGallery({ galleryData }: { galleryData: Gallery }) {
  const router = useRouter();

  const handleSave = async (formData: FormData) => {
    try {
      await updateGallery(galleryData.slug, formData);
      toast.success("Gallery updated successfully!");
      router.push("/gallery");
    } catch (err) {
      console.error("Error updating gallery:", err);
      toast.error("Failed to update gallery");
    }
  };

  return (
    <>
      <PageHeading heading="Edit Gallery" />
      <section className="page-padding max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <GalleryForm
            initialData={galleryData}
            onSubmit={handleSave}
            onCancel={() => router.back()}
            submitLabel="Save Changes"
          />
        </div>
      </section>
    </>
  );
}
