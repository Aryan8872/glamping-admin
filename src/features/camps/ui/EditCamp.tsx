"use client";
import { PageHeading } from "@/components/PageHeading";
import { CampSite } from "../types/campTypes";
import { updateCamp } from "../services/campService";
import CampForm from "./CampForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditCamp({ campData }: { campData: CampSite }) {
  const router = useRouter();

  const handleSave = async (formData: FormData) => {
    try {
      await updateCamp(campData.id, formData);
      toast.success("Camp updated successfully!");
      router.push("/camps");
    } catch (err) {
      console.error("Error updating camp:", err);
      toast.error("Failed to update camp");
    }
  };

  return (
    <>
      <PageHeading heading="Edit Camp" />
      <section className="page-padding max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <CampForm
            initialData={campData}
            onSubmit={handleSave}
            onCancel={() => router.back()}
            submitLabel="Save Changes"
          />
        </div>
      </section>
    </>
  );
}
