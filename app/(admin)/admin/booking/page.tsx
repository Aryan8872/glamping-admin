"use client";

import { useEffect, useState } from "react";
import BookingTable from "@/app/features/bookings/ui/BookingTable";
import { Booking } from "@/app/features/bookings/types/bookingTypes";
import { getAllBookings } from "@/app/features/bookings/services/bookingService";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Booking Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage all campsite bookings
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : (
          <BookingTable bookings={bookings} onRefresh={fetchBookings} />
        )}
      </div>
    </div>
  );
}
