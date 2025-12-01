"use client";

import { CampSite } from "../types/campTypes";
import { BiEdit, BiTrash } from "react-icons/bi";
import Link from "next/link";
import GenericTable, { Column } from "@/app/components/GenericTable";

export default function CampsTable({ camps }: { camps: CampSite[] }) {
  const columns: Column<CampSite>[] = [
    {
      header: "Camp",
      cell: (camp) => (
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {camp.images && camp.images.length > 0 ? (
              <img
                className="h-full w-full object-cover"
                src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${camp.images[0]}`}
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
            href={`/admin/camps/${camp.id}`}
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
      searchPlaceholder="Search camps..."
      emptyMessage='No camps found. Click "Create Camp" to add one.'
    />
  );
}
