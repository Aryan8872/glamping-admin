import { PaymentsStats } from "@/types/PaymentsTypes";

export default function StatsSection({ paymentsStats }: { paymentsStats: PaymentsStats }) {
    return (
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
            <div className="flex flex-col gap-3 px-3 py-3 rounded-lg shadow-sm bg-white">
                <span className="font-semibold text-lg sm:text-xl">Total Revenue</span>
                <span className={`text-2xl font-bold `}>$ {paymentsStats.TotalRevenue.value}</span>
                <span className={`${paymentsStats.TotalRevenue.changetype ? "text-green-500" : "text-red-500"}`}>{paymentsStats.TotalRevenue.change}</span>
            </div>

            <div className="flex flex-col gap-3 px-3 py-3 rounded-lg shadow-sm bg-white">
                <span className="font-semibold text-lg sm:text-xl">Overdue Payments</span>
                <span className={`text-2xl font-bold `}>$ {paymentsStats.OverduePayments.value}</span>
                <span className={`${paymentsStats.OverduePayments.changetype ? "text-green-500" : "text-red-500"}`}>{paymentsStats.OverduePayments.change}</span>
            </div>

               <div className="flex flex-col gap-3 px-3 py-3 rounded-lg shadow-sm bg-white">
                <span className="font-semibold text-lg sm:text-xl">Upcoming Renewals</span>
                <span className={`text-2xl font-bold `}>$ {paymentsStats.UpcomingRenewals.value}</span>
                <span className={`${paymentsStats.UpcomingRenewals.changetype ? "text-green-500" : "text-red-500"}`}>{paymentsStats.UpcomingRenewals.change}</span>
            </div>

               <div className="flex w-full flex-col gap-3 px-3 py-3 rounded-lg shadow-sm bg-white">
                <span className="font-semibold text-lg sm:text-xl">New Subscriptions</span>
                <span className={`text-2xl font-bold `}>$ {paymentsStats.NewSubscriptions.value}</span>
                <span className={`${paymentsStats.NewSubscriptions.changetype ? "text-green-500" : "text-red-500"}`}>{paymentsStats.NewSubscriptions.change}</span>
            </div>
        </div>
    )
}