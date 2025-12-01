"use server";

import { apiGetDashboardStats } from "../api/dashboardApi";

export const getDashboardStats = async () => {
    try {
        const stats = await apiGetDashboardStats();
        return stats;
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Return default values if API fails
        return {
            totalRevenue: 0,
            totalBookings: 0,
            activeCamps: 0,
            newMessages: 0,
        };
    }
};
