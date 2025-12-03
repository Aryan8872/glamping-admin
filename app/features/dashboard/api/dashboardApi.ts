import { HttpGet } from "@/lib/http/http";

export interface DashboardResponse {
    bookings: {
        total: number;
        active: number;
        completed: number;
        canceled: number;
        change?: number; // Added change percentage
    };
    revenue: {
        total: number;
        pending: number;
        monthly: { month: string; revenue: number }[];
        change?: number; // Added change percentage
    };
    camps: {
        total: number;
        available: number;
    };
    users: {
        total: number;
    };
    recentBookings: {
        id: number;
        checkInDate: string;
        checkOutDate: string;
        bookingStatus: string;
        totalPrice: number;
        guestUserFullName?: string;
        userInfo?: {
            fullName: string;
            email: string;
        };
        campSite: {
            name: string;
            slug: string;
        };
    }[];
}

export async function apiGetDashboardStats(): Promise<DashboardResponse> {
    const res = await HttpGet("dashboard/stats", { cache: 'no-store' });
    return res.data;
}

export const DASHBOARD_TAG = "dashboard";
