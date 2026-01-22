"use client";

import { CampSite } from "../types/campTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import Link from "next/link";
import GenericTable, { Column } from "@/components/GenericTable";
import { buildImageUrl, buildUrl } from "@/lib/http/http";

interface CampsTableProps {
  camps: CampSite[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  totalResults?: number;
}

export default function CampsTable({
  camps,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterChange,
  totalResults,
}: CampsTableProps) {
  const columns: Column<CampSite>[] = [
    {
      header: "Camp",
      cell: (camp) => (
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {camp.images && camp.images.length > 0 ? (
              <img
                className="h-full w-full object-cover"
                src={buildImageUrl(camp.images[0])}
                alt={camp.name}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                No Img
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{camp.name}</div>
            <div className="text-xs text-gray-500">{camp.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (camp) => (
        <div
          className="text-sm text-gray-500 max-w-xs truncate"
          title={camp.description}
        >
          {camp.description}
        </div>
      ),
    },
    {
      header: "Price / Night",
      cell: (camp) => (
        <div className="text-sm font-medium text-gray-900">
          ${Number(camp.pricePerNight).toFixed(2)}
        </div>
      ),
    },
    {
      header: "Created At",
      className: "hidden md:table-cell",
      cell: (camp) => (
        <div className="text-sm text-gray-500">
          {new Date(camp.createdAt).toLocaleDateString(undefined, {
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
      cell: (camp) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/camps/${camp.id}`}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Camp"
          >
            <BiEdit size={18} />
          </Link>
          <button
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Camp"
          >
            <BiTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <GenericTable
      data={camps}
      columns={columns}
      title="Camps Records"
      isLoading={isLoading}
      searchPlaceholder="Search camps..."
      emptyMessage='No camps found. Click "Create Camp" to add one.'
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onSearch={onSearch}
      totalResults={totalResults}
      filters={
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Featured:
          </label>
          <select
            onChange={(e) => onFilterChange?.({ isFeatured: e.target.value })}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-500 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All</option>
            <option value="true">Featured Only</option>
            <option value="false">Standard Only</option>
          </select>
        </div>
      }
    />
  );
}
