"use client";
import { BiPlusCircle } from "react-icons/bi";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { PageHeading } from "@/components/PageHeading";
import { useState, useEffect } from "react";
import CampsTable from "@/features/camps/ui/CampsTable";
import AddCamp from "@/features/camps/ui/AddCamp";
import { CampSite } from "@/features/camps/types/campTypes";
import { getAllCamps } from "@/features/camps/services/campService";
import { CAMP_API_KEY, useApiStore } from "@/stores/useLoad";

import { useSearch } from "@/hooks/useSearch";

export default function CampsPage() {
  const {
    data: camps,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<CampSite>({
    fetchFn: getAllCamps,
    perPage: 15,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-end">
        <PageHeading
          heading="Camps Management"
          subheading="Manage your campsites"
        />

        <PrimaryButton
          text="Create Camp"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <CampsTable
        camps={camps}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        totalResults={total}
      />

      {isAddModalOpen && (
        <AddCamp
          onClose={() => {
            setIsAddModalOpen(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
