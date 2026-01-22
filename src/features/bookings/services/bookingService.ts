"use server";

import { revalidateTag } from "next/cache";
import { apiCancelBooking, apiCreateBooking, apiGetAllBookings, apiGetBookingById, apiUpdateBooking } from "../api/bookingApi";
import { Booking, CreateBookingValues, UpdateBookingValues } from "../types/bookingTypes";

const BOOKING_TAG = "bookings";

import { apiWrapper } from "@/lib/apiWrapper";

export async function getAllBookings(params: any = {}): Promise<{ data: Booking[], total: number, page: number, perPage: number }> {
    return await apiGetAllBookings(params);
}

export async function getBookingById(id: number) {
    return apiWrapper(BOOKING_TAG, () => apiGetBookingById(id));
}

export async function createBooking(data: CreateBookingValues) {
    const res = await apiWrapper(BOOKING_TAG, () => apiCreateBooking(data));
    (revalidateTag as any)(BOOKING_TAG);
    return res;
}

export async function updateBooking(id: number, data: UpdateBookingValues) {
    const res = await apiWrapper(BOOKING_TAG, () => apiUpdateBooking(id, data));
    (revalidateTag as any)(BOOKING_TAG);
    return res;
}

export async function cancelBooking(id: number, reason?: string) {
    const res = await apiWrapper(BOOKING_TAG, () => apiCancelBooking(id, reason));
    (revalidateTag as any)(BOOKING_TAG);
    return res;
}
