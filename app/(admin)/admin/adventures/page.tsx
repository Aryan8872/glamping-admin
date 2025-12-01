"use client";

import { useState, useEffect } from "react";
import { Adventure } from "@/app/features/adventures/types/adventureTypes";
import { getAllAdventures } from "@/app/features/adventures/services/adventureService";
import AdventureTable from "@/app/features/adventures/ui/AdventureTable";
import AddAdventure from "@/app/features/adventures/ui/AddAdventure";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";

export default function AdventuresPage() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdventures();
  }, []);

  const fetchAdventures = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAdventures(true); // Include inactive
      setAdventures(data);
    } catch (error) {
      console.error("Failed to fetch adventures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Adventures Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage handpicked adventure collections for your campsites
          </p>
        </div>
        <PrimaryButton
          text="Create Adventure"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div className="bg-white px-3 rounded-lg shadow-md py-3">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading adventures...
          </div>
        ) : (
          <AdventureTable adventures={adventures} onRefresh={fetchAdventures} />
        )}
      </div>

      {isAddModalOpen && (
        <AddAdventure
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchAdventures();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
