"use client";

import { useState } from "react";
import { Adventure } from "../types/adventureTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import GenericTable, { Column } from "@/app/components/GenericTable";
import EditAdventure from "./EditAdventure";

interface AdventureTableProps {
  adventures: Adventure[];
  onRefresh: () => void;
}

export default function AdventureTable({
  adventures,
  onRefresh,
}: AdventureTableProps) {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(
    null
  );

  const handleDelete = async (adventure: Adventure) => {
    if (!confirm(`Are you sure you want to delete "${adventure.name}"?`))
      return;

    try {
      const { deleteAdventure } = await import("../services/adventureService");
      await deleteAdventure(adventure.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete adventure:", error);
      alert("Failed to delete adventure");
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
                src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${adventure.coverImage}`}
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
        searchPlaceholder="Search adventures..."
        emptyMessage='No adventures found. Click "Create Adventure" to add one.'
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
