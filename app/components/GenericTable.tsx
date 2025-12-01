"use client";

import { ReactNode, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function GenericTable<T extends { id: number | string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  onSearch,
  isLoading = false,
  emptyMessage = "No records found",
}: GenericTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full mt-3 overflow-x-auto px-2">
      <h2 className="text-xl sm:text-2xl font-semibold pl-2 text-gray-900">
        {title}
      </h2>
      <div className="w-full mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <BiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>

          <div className="">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date Range
            </label>
            <div className="cursor-pointer flex items-center h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-700 hover:border-blue-500 transition-colors">
              <MdDateRange className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">Select date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                      col.className || ""
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, rowIdx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        className={`px-6 py-4 whitespace-nowrap ${
                          col.className || ""
                        }`}
                      >
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? (item[col.accessorKey] as ReactNode)
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{data.length}</span> of{" "}
              <span className="font-medium">{data.length}</span> results
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
