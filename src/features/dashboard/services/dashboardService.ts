"use server";

import { apiGetDashboardStats, DASHBOARD_TAG, DashboardResponse } from "../api/dashboardApi";
import { revalidateTag } from "next/cache";

import { apiWrapper } from "@/lib/apiWrapper";

export async function getDashboardStats(): Promise<DashboardResponse> {
    return apiWrapper(DASHBOARD_TAG, () => apiGetDashboardStats());
}

export async function revalidateDashboard() {
    (revalidateTag as any)(DASHBOARD_TAG);
}
