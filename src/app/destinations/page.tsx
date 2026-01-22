"use client";

import { useState, useEffect } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Destination } from "@/features/destinations/types/destinationTypes";
import { getAllDestinations } from "@/features/destinations/services/destinationService";
import DestinationTable from "@/features/destinations/ui/DestinationTable";
import AddDestination from "@/features/destinations/ui/AddDestination";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";

import { useSearch } from "@/hooks/useSearch";

export default function DestinationsPage() {
  const {
    data: destinations,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<Destination>({
    fetchFn: getAllDestinations,
    perPage: 15,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-end">
        <PageHeading
          heading="Destinations Management"
          subheading="Manage popular regions and destinations"
        />
        <PrimaryButton
          text="Create Destination"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div>
        <DestinationTable
          destinations={destinations}
          isLoading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          totalResults={total}
          onRefresh={refresh}
        />
      </div>

      {isAddModalOpen && (
        <AddDestination
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            refresh();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
