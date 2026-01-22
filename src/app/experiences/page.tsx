"use client";

import { useState, useEffect } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Experience } from "@/features/experiences/types/experienceTypes";
import { getAllExperiences } from "@/features/experiences/services/experienceService";
import ExperienceTable from "@/features/experiences/ui/ExperienceTable";
import AddExperience from "@/features/experiences/ui/AddExperience";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";

import { useSearch } from "@/hooks/useSearch";

export default function ExperiencesPage() {
  const {
    data: experiences,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<Experience>({
    fetchFn: getAllExperiences,
    perPage: 15,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-end">
        <PageHeading
          heading="Experiences Management"
          subheading="Manage experience categories (e.g. Mountain, Riverside)"
        />
        <PrimaryButton
          text="Create Experience"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div>
        <ExperienceTable
          experiences={experiences}
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
        <AddExperience
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
