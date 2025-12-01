"use client";

import { useState } from "react";
import {
  Booking,
  BookingStatus,
  BookingPaymentStatus,
} from "../types/bookingTypes";
import { updateBooking, cancelBooking } from "../services/bookingService";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";

interface EditBookingProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBooking({
  booking,
  onClose,
  onSuccess,
}: EditBookingProps) {
  const [status, setStatus] = useState<BookingStatus>(booking.bookingStatus);
  const [paymentStatus, setPaymentStatus] = useState<BookingPaymentStatus>(
    booking.paymentStatus
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await updateBooking(booking.id, {
        bookingStatus: status,
        paymentStatus: paymentStatus,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update booking", error);
      alert("Failed to update booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setIsSubmitting(true);
    try {
      await cancelBooking(booking.id, "Cancelled by admin");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to cancel booking", error);
      alert("Failed to cancel booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalNights = differenceInCalendarDays(
    new Date(booking.checkOutDate),
    new Date(booking.checkInDate)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Booking #{booking.id}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Camp Details */}
          <div className="flex gap-4 items-start bg-blue-50 p-4 rounded-lg border border-blue-100">
            {booking.campSite?.images?.[0] ? (
              <img
                src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${booking.campSite.images[0]}`}
                alt={booking.campSite.name}
                className="w-20 h-20 object-cover rounded-lg bg-white"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-blue-400 text-xs">
                No Img
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {booking.campSite?.name || "Unknown Camp"}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {booking.campSite?.description}
              </p>
              <Link
                href={`/admin/camps/${booking.campSiteId}`}
                className="text-xs font-medium text-blue-600 hover:underline mt-1 inline-block"
                target="_blank"
              >
                View Camp Details &rarr;
              </Link>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Guest Name
              </label>
              <p className="text-sm font-medium text-gray-900">
                {booking.guestUserFullName ||
                  booking.userInfo?.fullName ||
                  "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Email
              </label>
              <p className="text-sm text-gray-700">
                {booking.guestUserEmail || booking.userInfo?.email || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Phone
              </label>
              <p className="text-sm text-gray-700">
                {booking.guestUserPhoneNumber ||
                  booking.userInfo?.phoneNumber ||
                  "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Dates
              </label>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(booking.checkInDate), "MMM dd")} -{" "}
                {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                <span className="text-gray-500 font-normal ml-1">
                  ({totalNights} Night{totalNights !== 1 ? "s" : ""})
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Status Updates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {Object.values(BookingStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as BookingPaymentStatus)
                }
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {Object.values(BookingPaymentStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <button
            onClick={handleCancel}
            disabled={
              isSubmitting || booking.bookingStatus === BookingStatus.CANCELED
            }
            className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Booking
          </button>

          <div className="flex gap-3">
            <SecondaryButton text="Close" onClick={onClose} />
            <PrimaryFilledButton
              text={isSubmitting ? "Saving..." : "Save Changes"}
              onClick={handleUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
