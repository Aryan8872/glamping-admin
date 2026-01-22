"use client";
import { fetchDiscounts } from "@/features/discount/service/discountService";
import { Discount } from "@/features/discount/types/discountTypes";
import DiscountTable from "@/features/discount/ui/DiscountTable";
import { useEffect, useState } from "react";

import { useSearch } from "@/hooks/useSearch";

export default function DiscountPage() {
  const {
    data: discountData,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<Discount>({
    fetchFn: fetchDiscounts,
    perPage: 15,
  });

  return (
    <div>
      <DiscountTable
        discount={discountData}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        totalResults={total}
        onRefresh={refresh}
      />
    </div>
  );
}
