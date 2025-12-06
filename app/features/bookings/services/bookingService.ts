"use server";

import { revalidateTag } from "next/cache";
import { apiCancelBooking, apiCreateBooking, apiGetAllBookings, apiGetBookingById, apiUpdateBooking } from "../api/bookingApi";
import { CreateBookingValues, UpdateBookingValues } from "../types/bookingTypes";

const BOOKING_TAG = "bookings";

import { apiWrapper } from "@/lib/apiWrapper";

export async function getAllBookings() {
    return apiWrapper(BOOKING_TAG, apiGetAllBookings);
}

export async function getBookingById(id: number) {
    return apiWrapper(BOOKING_TAG, () => apiGetBookingById(id));
}

export async function createBooking(data: CreateBookingValues) {
    const res = await apiWrapper(BOOKING_TAG, () => apiCreateBooking(data));
    revalidateTag(BOOKING_TAG);
    return res;
}

export async function updateBooking(id: number, data: UpdateBookingValues) {
    const res = await apiWrapper(BOOKING_TAG, () => apiUpdateBooking(id, data));
    revalidateTag(BOOKING_TAG);
    return res;
}

export async function cancelBooking(id: number, reason?: string) {
    const res = await apiWrapper(BOOKING_TAG, () => apiCancelBooking(id, reason));
    revalidateTag(BOOKING_TAG);
    return res;
}
