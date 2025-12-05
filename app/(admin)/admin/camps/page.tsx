"use client";
import { BiPlusCircle } from "react-icons/bi";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { useState, useEffect } from "react";
import CampsTable from "@/app/features/camps/ui/CampsTable";
import AddCamp from "@/app/features/camps/ui/AddCamp";
import { CampSite } from "@/app/features/camps/types/campTypes";
import { getAllCamps } from "@/app/features/camps/services/campService";
import { CAMP_API_KEY, useApiStore } from "@/stores/useLoad";

export default function CampsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [camps, setCamps] = useState<CampSite[]>([]);
  const loading = useApiStore((s) => s.loading[CAMP_API_KEY]);
  const error = useApiStore((s) => s.error[CAMP_API_KEY]);
  useEffect(() => {
    getAllCamps().then(setCamps);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-end lg:justify-between">
        <p className="hidden lg:flex flex-col gap-1">
          <span className="text-2xl font-semibold">Camps Management</span>
          <span className="text-sm text-gray-500">Manage your campsites</span>
        </p>

        <PrimaryButton
          text="Create Camp"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading camps...</div>
      ) : error ? (
        <div className="p-10 text-center text-red-500">
          Failed to load camps: {error}
        </div>
      ) : (
        <div className="bg-white px-3 rounded-lg shadow-md py-3">
          <CampsTable camps={camps} />
        </div>
      )}

      {isAddModalOpen && (
        <AddCamp
          onClose={() => {
            setIsAddModalOpen(false);
            getAllCamps().then(setCamps);
          }}
        />
      )}
    </div>
  );
}
