"use client";

import React from "react";
import BookingTable from "@/features/bookings/ui/BookingTable";
import { PageHeading } from "@/components/PageHeading";
import { Booking } from "@/features/bookings/types/bookingTypes";
import { getAllBookings } from "@/features/bookings/services/bookingService";

import { useSearch } from "@/hooks/useSearch";

export default function BookingsPage() {
  const {
    data: bookings,
    loading,
    total,
    page,
    totalPages,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    refresh,
  } = useSearch<Booking>({
    fetchFn: getAllBookings,
    perPage: 15,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <PageHeading
          heading="Booking Management"
          subheading="View and manage all campsite bookings"
        />
      </div>

      <div>
        <BookingTable
          bookings={bookings}
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
    </div>
  );
}
