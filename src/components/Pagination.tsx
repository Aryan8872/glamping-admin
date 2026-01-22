"use client";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalResults?: number;
  resultsOnPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  totalResults = 0,
  resultsOnPage = 0,
}: PaginationProps) {
  if (totalPages <= 1 && totalResults <= resultsOnPage) return null;

  return (
    <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
      <span className="text-xs font-medium text-gray-500">
        Showing <span className="text-gray-900">{resultsOnPage}</span> of{" "}
        <span className="text-gray-900">{totalResults}</span> results
      </span>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mr-2">
          Page <span className="text-gray-900">{currentPage}</span> of{" "}
          <span className="text-gray-900">{totalPages}</span>
        </div>
        <div className="flex gap-2 flex-1 sm:flex-none">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="flex-1 sm:flex-none h-9 px-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-sm"
          >
            <MdChevronLeft size={18} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="flex-1 sm:flex-none h-9 px-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
