"use server";

import { apiGetDashboardStats, DASHBOARD_TAG, DashboardResponse } from "../api/dashboardApi";
import { revalidateTag } from "next/cache";

export async function getDashboardStats(): Promise<DashboardResponse> {
    try {
        const data = await apiGetDashboardStats();
        return data;
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        throw error;
    }
}

export async function revalidateDashboard() {
    revalidateTag(DASHBOARD_TAG);
}
