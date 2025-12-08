"use client";

import { useState } from "react";
import { Experience } from "../types/experienceTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/app/components/GenericTable";
import EditExperience from "./EditExperience";
import Image from "next/image";

interface ExperienceTableProps {
  experiences: Experience[];
  onRefresh: () => void;
}

export default function ExperienceTable({
  experiences,
  onRefresh,
}: ExperienceTableProps) {
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  const handleDelete = async (experience: Experience) => {
    if (!confirm(`Are you sure you want to delete "${experience.title}"?`))
      return;

    try {
      const { deleteExperience } = await import(
        "../services/experienceService"
      );
      await deleteExperience(experience.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience");
    }
  };

  const columns: Column<Experience>[] = [
    {
      header: "Experience",
      cell: (exp) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {exp.imageUrl ? (
              <img
                className="h-full w-full object-cover"
                src={`${
                  process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL
                }${exp.imageUrl.replace(/\\/g, "/")}`}
                alt={exp.title}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px] text-center p-1">
                No Image
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{exp.title}</div>
            <div className="text-xs text-gray-500">{exp.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (exp) => (
        <div
          className="text-sm text-gray-500 max-w-xs truncate"
          title={exp.description}
        >
          {exp.description}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (exp) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            exp.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {exp.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (exp) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedExperience(exp)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Experience"
          >
            <BiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(exp)}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Experience"
          >
            <BiTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <GenericTable
        data={experiences}
        columns={columns}
        title="Experiences"
        searchPlaceholder="Search experiences..."
        emptyMessage='No experiences found. Click "Create Experience" to add one.'
      />

      {selectedExperience && (
        <EditExperience
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onSuccess={() => {
            onRefresh();
            setSelectedExperience(null);
          }}
        />
      )}
    </>
  );
}
