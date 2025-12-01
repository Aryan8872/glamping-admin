"use server";

import { revalidateTag } from "next/cache";
import { apiCancelBooking, apiCreateBooking, apiGetAllBookings, apiGetBookingById, apiUpdateBooking } from "../api/bookingApi";
import { CreateBookingValues, UpdateBookingValues } from "../types/bookingTypes";

const BOOKING_TAG = "bookings";

export async function getAllBookings() {
    return await apiGetAllBookings();
}

export async function getBookingById(id: number) {
    return await apiGetBookingById(id);
}

export async function createBooking(data: CreateBookingValues) {
    const res = await apiCreateBooking(data);
    revalidateTag(BOOKING_TAG);
    return res;
}

export async function updateBooking(id: number, data: UpdateBookingValues) {
    const res = await apiUpdateBooking(id, data);
    revalidateTag(BOOKING_TAG);
    return res;
}

export async function cancelBooking(id: number, reason?: string) {
    const res = await apiCancelBooking(id, reason);
    revalidateTag(BOOKING_TAG);
    return res;
}
