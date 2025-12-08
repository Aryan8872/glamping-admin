"use client";

import { useState, useEffect } from "react";
import { Experience } from "@/app/features/experiences/types/experienceTypes";
import { getAllExperiences } from "@/app/features/experiences/services/experienceService";
import ExperienceTable from "@/app/features/experiences/ui/ExperienceTable";
import AddExperience from "@/app/features/experiences/ui/AddExperience";
import PrimaryButton from "@/components/PrimaryFilledButton";
import { BiPlusCircle } from "react-icons/bi";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const data = await getAllExperiences();
      setExperiences(data || []);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Experiences Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage experience categories (e.g. Mountain, Riverside)
          </p>
        </div>
        <PrimaryButton
          text="Create Experience"
          icon={<BiPlusCircle size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <div className="bg-white px-3 rounded-lg shadow-md py-3">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading experiences...
          </div>
        ) : (
          <ExperienceTable
            experiences={experiences}
            onRefresh={fetchExperiences}
          />
        )}
      </div>

      {isAddModalOpen && (
        <AddExperience
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchExperiences();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
