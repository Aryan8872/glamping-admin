import QuickActions from "@/app/features/dashboard/ui/QuickActions";
import RecentBookings from "@/app/features/dashboard/ui/RecentBookings";
import StatsGrid from "@/app/features/dashboard/ui/StatsGrid";
import { PageHeading } from "@/components/PageHeading";
import { BiBed, BiCalendar, BiEnvelope, BiMoney } from "react-icons/bi";
import { getDashboardStats } from "@/app/features/dashboard/services/dashboardService";
import { getRecentBookings } from "@/app/features/bookings/services/bookingService";

export default async function DashboardPage() {
  // Fetch real data
  const dashboardStats = await getDashboardStats();
  const bookingsData = await getRecentBookings();

  // Take only the 5 most recent bookings
  const recentBookings = bookingsData.slice(0, 5).map((booking) => ({
    id: booking.id,
    guest: booking.user?.fullName || "Unknown",
    camp: booking.campSite?.name || "Unknown",
    dates: `${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(
      booking.checkOutDate
    ).toLocaleDateString()}`,
    status: booking.bookingStatus,
    amount: `$${booking.totalPrice}`,
  }));

  const stats = [
    {
      label: "Total Revenue",
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: dashboardStats.revenueChange || "0%",
      isPositive: true,
      icon: BiMoney,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Bookings",
      value: dashboardStats.totalBookings.toString(),
      change: dashboardStats.bookingsChange || "0%",
      isPositive: true,
      icon: BiCalendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Camps",
      value: dashboardStats.activeCamps.toString(),
      change: dashboardStats.campsChange || "0%",
      isPositive: true,
      icon: BiBed,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "New Messages",
      value: dashboardStats.newMessages.toString(),
      change: dashboardStats.messagesChange || "0%",
      isPositive: true,
      icon: BiEnvelope,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="w-full space-y-8">
      <PageHeading
        heading="Dashboard"
        subheading="Overview of your glamping business"
      />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentBookings recentBookings={recentBookings} />
        <QuickActions />
      </div>
    </div>
  );
}
