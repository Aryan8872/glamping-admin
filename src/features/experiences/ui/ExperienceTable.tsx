"use client";

import { useState } from "react";
import { Experience } from "../types/experienceTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/components/GenericTable";
import EditExperience from "./EditExperience";
import Image from "next/image";
import { buildImageUrl, buildUrl } from "@/lib/http/http";
import { toast } from "react-toastify";
import { useConfirm } from "@/stores/useConfirm";

interface ExperienceTableProps {
  experiences: Experience[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  totalResults?: number;
  onRefresh: () => void;
}

export default function ExperienceTable({
  experiences,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterChange,
  totalResults,
  onRefresh,
}: ExperienceTableProps) {
  const confirm = useConfirm((s) => s.confirm);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  const handleDelete = async (experience: Experience) => {
    const ok = await confirm(
      `Are you sure you want to delete "${experience.title}"?`,
    );
    if (!ok) return;

    try {
      const { deleteExperience } =
        await import("../services/experienceService");
      await deleteExperience(experience.id);
      toast.success("Experience deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete experience:", error);
      toast.error("Failed to delete experience");
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
                src={buildImageUrl(exp.imageUrl)}
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
        isLoading={isLoading}
        searchPlaceholder="Search experiences..."
        emptyMessage='No experiences found. Click "Create Experience" to add one.'
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSearch={onSearch}
        totalResults={totalResults}
        filters={
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Status:
            </label>
            <select
              onChange={(e) => onFilterChange?.({ isActive: e.target.value })}
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-500 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        }
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
