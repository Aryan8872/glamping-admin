"use client";

import { useState } from "react";
import { Adventure } from "@/features/adventures/types/adventureTypes";
import { getAllAdventures } from "@/features/adventures/services/adventureService";
import AdventureTable from "@/features/adventures/ui/AdventureTable";
import AddAdventure from "@/features/adventures/ui/AddAdventure";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";
import { useSearch } from "@/hooks/useSearch";
import { PageHeading } from "@/components/PageHeading";

export default function AdventuresPage() {
  const {
    data: adventures,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<Adventure>({
    fetchFn: getAllAdventures,
    perPage: 15,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <PageHeading
          heading="Adventures Management"
          subheading="Manage handpicked adventure collections for your campsites"
        />
        <PrimaryButton
          text="Create Adventure"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div>
        <AdventureTable
          adventures={adventures}
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
        <AddAdventure
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
