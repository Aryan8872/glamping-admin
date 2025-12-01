import { HttpGet } from "@/lib/http/http";

export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    activeCamps: number;
    newMessages: number;
    revenueChange?: string;
    bookingsChange?: string;
    campsChange?: string;
    messagesChange?: string;
}

export const apiGetDashboardStats = async (): Promise<DashboardStats> => {
    const response = await HttpGet<{ data: DashboardStats }>("dashboard/stats");
    return response.data;
};
