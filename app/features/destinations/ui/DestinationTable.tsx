"use client";

import { useState } from "react";
import { Destination } from "../types/destinationTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/app/components/GenericTable";
import EditDestination from "./EditDestination";
import { FaStar } from "react-icons/fa";

interface DestinationTableProps {
  destinations: Destination[];
  onRefresh: () => void;
}

export default function DestinationTable({
  destinations,
  onRefresh,
}: DestinationTableProps) {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const handleDelete = async (destination: Destination) => {
    if (!confirm(`Are you sure you want to delete "${destination.name}"?`))
      return;

    try {
      const { deleteDestination } = await import(
        "../services/destinationService"
      );
      await deleteDestination(destination.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete destination:", error);
      alert("Failed to delete destination");
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
                src={`${
                  process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL
                }${dest.imageUrl.replace(/\\/g, "/")}`}
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
        searchPlaceholder="Search destinations..."
        emptyMessage='No destinations found. Click "Create Destination" to add one.'
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
