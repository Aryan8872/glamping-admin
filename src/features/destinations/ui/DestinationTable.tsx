"use client";

import { useState } from "react";
import { Destination } from "../types/destinationTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/components/GenericTable";
import EditDestination from "./EditDestination";
import { FaStar } from "react-icons/fa";
import { buildImageUrl, buildUrl } from "@/lib/http/http";
import { toast } from "react-toastify";
import { useConfirm } from "@/stores/useConfirm";

interface DestinationTableProps {
  destinations: Destination[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  totalResults?: number;
  onRefresh: () => void;
}

export default function DestinationTable({
  destinations,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterChange,
  totalResults,
  onRefresh,
}: DestinationTableProps) {
  const confirm = useConfirm((s) => s.confirm);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const handleDelete = async (destination: Destination) => {
    const ok = await confirm(
      `Are you sure you want to delete "${destination.name}"?`,
    );
    if (!ok) return;

    try {
      const { deleteDestination } =
        await import("../services/destinationService");
      await deleteDestination(destination.id);
      toast.success("Destination deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete destination:", error);
      toast.error("Failed to delete destination");
    }
  };

  const columns: Column<Destination>[] = [
    {
      header: "Destination",
      cell: (dest) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {dest.imageUrl ? (
              <img
                className="h-full w-full object-cover"
                src={buildImageUrl(dest.imageUrl)}
                alt={dest.name}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                No Img
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{dest.name}</div>
            <div className="text-xs text-gray-500">{dest.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (dest) => (
        <div
          className="text-sm text-gray-500 max-w-xs truncate"
          title={dest.description}
        >
          {dest.description}
        </div>
      ),
    },
    {
      header: "Featured",
      cell: (dest) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
            dest.isFeatured
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {dest.isFeatured && <FaStar size={10} />}
          {dest.isFeatured ? "Featured" : "Standard"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (dest) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            dest.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {dest.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (dest) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedDestination(dest)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Destination"
          >
            <BiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(dest)}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Destination"
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
        data={destinations}
        columns={columns}
        title="Destinations"
        isLoading={isLoading}
        searchPlaceholder="Search destinations..."
        emptyMessage='No destinations found. Click "Create Destination" to add one.'
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSearch={onSearch}
        totalResults={totalResults}
        filters={
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Featured:
              </label>
              <select
                onChange={(e) =>
                  onFilterChange?.({ isFeatured: e.target.value })
                }
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-500 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All</option>
                <option value="true">Featured Only</option>
                <option value="false">Standard Only</option>
              </select>
            </div>
          </div>
        }
      />

      {selectedDestination && (
        <EditDestination
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onSuccess={() => {
            onRefresh();
            setSelectedDestination(null);
          }}
        />
      )}
    </>
  );
}
