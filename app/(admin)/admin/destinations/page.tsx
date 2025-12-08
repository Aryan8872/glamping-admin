"use client";

import { useState, useEffect } from "react";
import { Destination } from "@/app/features/destinations/types/destinationTypes";
import { getAllDestinations } from "@/app/features/destinations/services/destinationService";
import DestinationTable from "@/app/features/destinations/ui/DestinationTable";
import AddDestination from "@/app/features/destinations/ui/AddDestination";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDestinations();
      setDestinations(data || []);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Destinations Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage popular regions and destinations
          </p>
        </div>
        <PrimaryButton
          text="Create Destination"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div className="bg-white px-3 rounded-lg shadow-md py-3">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading destinations...
          </div>
        ) : (
          <DestinationTable
            destinations={destinations}
            onRefresh={fetchDestinations}
          />
        )}
      </div>

      {isAddModalOpen && (
        <AddDestination
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchDestinations();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
