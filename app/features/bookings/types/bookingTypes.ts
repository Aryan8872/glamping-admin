import { z } from "zod";
import { CampSite } from "../../camps/types/campTypes";
import { User } from "../../users/types/UserTypes";

export enum BookingStatus {
    BOOKED = "BOOKED",
    CANCELED = "CANCELED",
    COMPLETED = "COMPLETED",
}

export enum BookingPaymentStatus {
    PENDING = "PENDING",
    CLEARED = "CLEARED",
}

export interface Booking {
    id: number;
    userId?: number;
    userInfo?: User;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    pets: number;
    guestUserFullName?: string;
    guestUserEmail?: string;
    guestUserPhoneNumber?: string;
    totalPrice: number;
    paymentStatus: BookingPaymentStatus;
    campSiteId: number;
    bookingStatus: BookingStatus;
    campSite: CampSite;
}

export const CreateBookingSchema = z.object({
    campSiteId: z.number().int().positive(),
    userId: z.number().int().positive().optional(),
    checkInDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid checkInDate" }),
    checkOutDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid checkOutDate" }),
    adults: z.number().int().min(1).optional().default(1),
    children: z.number().int().min(0).optional().default(0),
    pets: z.number().int().min(0).optional().default(0),
    guestUserFullName: z.string().optional(),
    guestUserEmail: z.string().email().optional(),
    guestUserPhoneNumber: z.string().optional(),
    paymentReference: z.string().optional(),
});

export const UpdateBookingSchema = z.object({
    checkInDate: z.string().optional(),
    checkOutDate: z.string().optional(),
    adults: z.number().optional(),
    children: z.number().optional(),
    pets: z.number().optional(),
    bookingStatus: z.nativeEnum(BookingStatus).optional(),
    paymentStatus: z.nativeEnum(BookingPaymentStatus).optional(),
});

export type CreateBookingValues = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingValues = z.infer<typeof UpdateBookingSchema>;
