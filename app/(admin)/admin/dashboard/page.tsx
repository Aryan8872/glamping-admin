"use client";
import QuickActions from "@/app/features/dashboard/ui/QuickActions";
import RecentBookings from "@/app/features/dashboard/ui/RecentBookings";
import StatsGrid from "@/app/features/dashboard/ui/StatsGrid";
import { PageHeading } from "@/components/PageHeading";
import { motion } from "framer-motion";
import { BiBed, BiCalendar, BiEnvelope, BiMoney } from "react-icons/bi";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

export default function DashboardPage() {
  // Mock Data
  const stats = [
    { label: "Total Revenue", value: "$12,500", change: "+12.5%", isPositive: true, icon: BiMoney, color: "bg-green-100 text-green-600" },
    { label: "Total Bookings", value: "154", change: "+8.2%", isPositive: true, icon: BiCalendar, color: "bg-blue-100 text-blue-600" },
    { label: "Active Camps", value: "12", change: "0%", isPositive: true, icon: BiBed, color: "bg-purple-100 text-purple-600" },
    { label: "New Messages", value: "28", change: "+5.3%", isPositive: true, icon: BiEnvelope, color: "bg-orange-100 text-orange-600" },
  ];

  const recentBookings = [
    { id: 1, guest: "Alice Johnson", camp: "Sunset Glamp", dates: "Oct 24 - 26", status: "Confirmed", amount: "$450" },
    { id: 2, guest: "Bob Smith", camp: "Forest Retreat", dates: "Oct 28 - 30", status: "Pending", amount: "$320" },
    { id: 3, guest: "Charlie Brown", camp: "Lakeside Cabin", dates: "Nov 01 - 05", status: "Confirmed", amount: "$890" },
    { id: 4, guest: "Diana Prince", camp: "Mountain View", dates: "Nov 10 - 12", status: "Cancelled", amount: "$210" },
  ];

  return (
    <div className="w-full space-y-8">
      <PageHeading heading="Dashboard" subheading="Overview of your glamping business" />
      <StatsGrid stats={stats}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentBookings recentBookings={recentBookings}/>
        {/* Popular / Quick Actions */}
        <QuickActions/>
      </div>
    </div>
  );
}
