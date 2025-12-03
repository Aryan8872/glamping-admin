"use client";

import { useEffect, useState } from "react";
import QuickActions from "@/app/features/dashboard/ui/QuickActions";
import RecentBookings from "@/app/features/dashboard/ui/RecentBookings";
import StatsGrid, { StatItem } from "@/app/features/dashboard/ui/StatsGrid";
import { PageHeading } from "@/components/PageHeading";
import { DashboardResponse } from "@/app/features/dashboard/api/dashboardApi";
import { HttpGet } from "@/lib/http/http";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await HttpGet("dashboard/stats", { cache: "no-store" });
        const data: DashboardResponse = res.data;
        setDashboardData(data);

        if (data) {
          // Transform API data to component format
          const revenueChange = data.revenue?.change ?? 0;
          const bookingsChange = data.bookings?.change ?? 0;

          setStats([
            {
              label: "Total Revenue",
              value: `$${(data.revenue?.total ?? 0).toLocaleString()}`,
              change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(
                1
              )}%`,
              isPositive: revenueChange >= 0,
              icon: "money",
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Total Bookings",
              value: (data.bookings?.total ?? 0).toString(),
              change: `${
                bookingsChange >= 0 ? "+" : ""
              }${bookingsChange.toFixed(1)}%`,
              isPositive: bookingsChange >= 0,
              icon: "calendar",
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Active Camps",
              value: (data.camps?.total ?? 0).toString(),
              change: "0%",
              isPositive: true,
              icon: "bed",
              color: "bg-purple-100 text-purple-600",
            },
            {
              label: "Active Bookings",
              value: (data.bookings?.active ?? 0).toString(),
              change: "0%",
              isPositive: true,
              icon: "envelope",
              color: "bg-orange-100 text-orange-600",
            },
          ]);

          // Transform recent bookings
          setRecentBookings(
            (data.recentBookings || []).map((booking) => ({
              id: booking.id,
              guest:
                booking.userInfo?.fullName ||
                booking.guestUserFullName ||
                "Guest",
              camp: booking.campSite?.name || "Unknown Camp",
              dates: `${new Date(booking.checkInDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )} - ${new Date(booking.checkOutDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}`,
              status: booking.bookingStatus,
              amount: `$${booking.totalPrice}`,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);

        // Fallback to empty data if API fails
        setStats([
          {
            label: "Total Revenue",
            value: "$0",
            change: "0%",
            isPositive: true,
            icon: "money",
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Total Bookings",
            value: "0",
            change: "0%",
            isPositive: true,
            icon: "calendar",
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Active Camps",
            value: "0",
            change: "0%",
            isPositive: true,
            icon: "bed",
            color: "bg-purple-100 text-purple-600",
          },
          {
            label: "Active Bookings",
            value: "0",
            change: "0%",
            isPositive: true,
            icon: "envelope",
            color: "bg-orange-100 text-orange-600",
          },
        ]);
        setRecentBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <PageHeading
          heading="Dashboard"
          subheading="Overview of your glamping business"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <PageHeading
        heading="Dashboard"
        subheading="Overview of your glamping business"
      />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentBookings recentBookings={recentBookings} />
        {/* Popular / Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
