"use client";

import { useState } from "react";
import {
  Booking,
  BookingStatus,
  BookingPaymentStatus,
} from "../types/bookingTypes";
import { format } from "date-fns";
import { BiEdit } from "react-icons/bi";
import EditBooking from "./EditBooking";
import GenericTable, { Column } from "@/app/components/GenericTable";

interface BookingTableProps {
  bookings: Booking[];
  onRefresh: () => void;
}

export default function BookingTable({
  bookings,
  onRefresh,
}: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.BOOKED:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.CANCELED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: BookingPaymentStatus) => {
    switch (status) {
      case BookingPaymentStatus.CLEARED:
        return "text-green-600 bg-green-50 border-green-200";
      case BookingPaymentStatus.PENDING:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "ID",
      cell: (booking) => <span>#{booking.id}</span>,
    },
    {
      header: "Guest",
      cell: (booking) => (
        <div>
          <div className="font-medium">
            {booking.guestUserFullName ||
              booking.userInfo?.fullName ||
              "Unknown"}
          </div>
          <div className="text-xs text-gray-400 font-normal">
            {booking.guestUserEmail || booking.userInfo?.email}
          </div>
        </div>
      ),
    },
    {
      header: "Camp",
      accessorKey: "campSite",
      cell: (booking) => booking.campSite?.name || "N/A",
    },
    {
      header: "Check-In",
      accessorKey: "checkInDate",
      cell: (booking) => format(new Date(booking.checkInDate), "MMM dd, yyyy"),
    },
    {
      header: "Check-Out",
      accessorKey: "checkOutDate",
      cell: (booking) => format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
    },
    {
      header: "Status",
      accessorKey: "bookingStatus",
      cell: (booking) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
            booking.bookingStatus
          )}`}
        >
          {booking.bookingStatus}
        </span>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: (booking) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentColor(
            booking.paymentStatus
          )}`}
        >
          {booking.paymentStatus}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "totalPrice",
      cell: (booking) => (
        <span className="font-medium">
          ${Number(booking.totalPrice).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (booking) => (
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedBooking(booking)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Booking"
          >
            <BiEdit size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <GenericTable
        data={bookings}
        columns={columns}
        title="Booking Records"
        emptyMessage="No bookings found"
      />

      {selectedBooking && (
        <EditBooking
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            onRefresh();
            setSelectedBooking(null);
          }}
        />
      )}
    </>
  );
}
