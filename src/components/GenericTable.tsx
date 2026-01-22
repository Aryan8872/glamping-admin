"use client";

import { ReactNode, useState, useEffect } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { MdDateRange, MdChevronLeft, MdChevronRight } from "react-icons/md";

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
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalResults?: number;
  filters?: ReactNode;
}

export default function GenericTable<T extends { id: number | string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  onSearch,
  isLoading = false,
  emptyMessage = "No records found",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalResults = 0,
  filters,
}: GenericTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
  };

  // Debounced search could be added here or in the parent,
  // but for admin panels, usually simple is fine.
  // Let's assume the parent handles debouncing if needed.

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Data
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <BiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              />
              <input
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                placeholder={searchPlaceholder}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <BiX size={18} />
                </button>
              )}
            </div>
          </div>

          {filters && <div className="flex items-center gap-3">{filters}</div>}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest ${
                      col.className || ""
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-500 font-medium">
                        Loading records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, rowIdx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        className={`px-6 py-4 text-sm text-gray-600 transition-colors group-hover:text-gray-900 ${
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
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                        <BiSearch size={24} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {(data.length > 0 || totalResults > 0) && (
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-medium text-gray-500">
              Showing <span className="text-gray-900">{data.length}</span> of{" "}
              <span className="text-gray-900">{totalResults}</span> results
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mr-2">
                Page <span className="text-gray-900">{currentPage}</span> of{" "}
                <span className="text-gray-900">{totalPages}</span>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-none">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  className="flex-1 sm:flex-none h-9 px-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <MdChevronLeft size={18} />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  className="flex-1 sm:flex-none h-9 px-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <MdChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
