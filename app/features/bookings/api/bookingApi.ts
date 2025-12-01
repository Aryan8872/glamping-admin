import { HttpGet, HttpPost, HttpPut } from "@/lib/http/http";
import { Booking, CreateBookingValues, UpdateBookingValues } from "../types/bookingTypes";

export async function apiGetAllBookings() {
    const res = await HttpGet("booking/all");
    return res.data as Booking[];
}

export async function apiGetBookingById(id: number) {
    const res = await HttpGet(`booking/${id}`);
    return res.data as Booking;
}

export async function apiCreateBooking(payload: CreateBookingValues) {
    const res = await HttpPost("booking/new", payload);
    return res.data;
}

export async function apiUpdateBooking(id: number, payload: UpdateBookingValues) {
    const res = await HttpPut(`booking/update/${id}`, payload);
    return res.data;
}

export async function apiCancelBooking(id: number, reason?: string) {
    const res = await HttpPost(`booking/${id}/cancel`, { reason });
    return res.data;
}
