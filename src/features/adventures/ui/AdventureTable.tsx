"use client";

import { useState } from "react";
import { Adventure } from "../types/adventureTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/components/GenericTable";
import EditAdventure from "./EditAdventure";
import { buildImageUrl, buildUrl } from "@/lib/http/http";
import { toast } from "react-toastify";
import { useConfirm } from "@/stores/useConfirm";

interface AdventureTableProps {
  adventures: Adventure[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  totalResults?: number;
  onRefresh: () => void;
}

export default function AdventureTable({
  adventures,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterChange,
  totalResults,
  onRefresh,
}: AdventureTableProps) {
  const confirm = useConfirm((s) => s.confirm);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(
    null,
  );

  const handleDelete = async (adventure: Adventure) => {
    const ok = await confirm(
      `Are you sure you want to delete "${adventure.name}"?`,
    );
    if (!ok) return;

    try {
      const { deleteAdventure } = await import("../services/adventureService");
      await deleteAdventure(adventure.id);
      toast.success("Adventure deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete adventure:", error);
      toast.error("Failed to delete adventure");
    }
  };

  const columns: Column<Adventure>[] = [
    {
      header: "Adventure",
      cell: (adventure) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {adventure.coverImage ? (
              <img
                className="h-full w-full object-cover"
                src={buildImageUrl(adventure.coverImage)}
                alt={adventure.name}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                No Img
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {adventure.name}
            </div>
            <div className="text-xs text-gray-500">{adventure.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (adventure) => (
        <div
          className="text-sm text-gray-500 max-w-xs truncate"
          title={adventure.description}
        >
          {adventure.description}
        </div>
      ),
    },
    {
      header: "Camps",
      cell: (adventure) => (
        <div className="text-sm font-medium text-gray-900">
          {adventure.campSites?.length || 0}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (adventure) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            adventure.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {adventure.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created",
      className: "hidden md:table-cell",
      cell: (adventure) => (
        <div className="text-sm text-gray-500">
          {new Date(adventure.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (adventure) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedAdventure(adventure)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Adventure"
          >
            <BiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(adventure)}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Adventure"
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
        data={adventures}
        columns={columns}
        title="Adventures"
        isLoading={isLoading}
        searchPlaceholder="Search adventures..."
        emptyMessage='No adventures found. Click "Create Adventure" to add one.'
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

      {selectedAdventure && (
        <EditAdventure
          adventure={selectedAdventure}
          onClose={() => setSelectedAdventure(null)}
          onSuccess={() => {
            onRefresh();
            setSelectedAdventure(null);
          }}
        />
      )}
    </>
  );
}
