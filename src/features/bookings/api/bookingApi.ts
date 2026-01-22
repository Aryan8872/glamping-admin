import { HttpGet, HttpPatch, HttpPost, HttpPut } from "@/lib/http/http";
import { Booking, CreateBookingValues, UpdateBookingValues } from "../types/bookingTypes";

export async function apiGetAllBookings(params: any = {}): Promise<{ data: Booking[], total: number, page: number, perPage: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const res = await HttpGet(`booking/all?${query.toString()}`);
    return res;
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
    const res = await HttpPut(`booking/${id}`, payload);
    return res.data;
}

export async function apiCancelBooking(id: number, reason?: string) {
    const res = await HttpPatch(`booking/${id}/cancel`, { reason });
    return res.data;
}
