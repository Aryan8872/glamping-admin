import { BiPlusCircle } from "react-icons/bi";
import PaymentTable from "./PaymentTable";
import PrimaryButton from "@/components/PrimaryFilledButton";
import StatsSection from "./StatsSection";
import OverDueSection from "./OverDueSection";

export default function Payments() {
  const paymentsStats = {
    TotalRevenue: {
      value: 125000,
      change: "+12.5%",
      changetype: true,
    },
    OverduePayments: {
      value: 8500,
      change: "-8.3%",
      changetype: false,
    },
    UpcomingRenewals: {
      value: 42,
      change: "+5.0%",
      changetype: true,
    },
    NewSubscriptions: {
      value: 18,
      change: "+20.0%",
      changetype: true,
    },
  };

  const paymentDatas = [
    {
      payment_id: "PAY-001",
      invoice_id: "INV-2025-1001",
      payment_method: "Khalti",
      transaction_id: "KHT-98FJ2L45",
      amount: 899,
      status: "completed",
      processed_at: "2025-10-10T14:35:00Z",
    },
    {
      payment_id: "PAY-002",
      invoice_id: "INV-2025-1002",
      payment_method: "eSewa",
      transaction_id: "ESW-77FD9Q10",
      amount: 499,
      status: "pending",
      processed_at: "2025-10-18T09:10:00Z",
    },
    {
      payment_id: "PAY-003",
      invoice_id: "INV-2025-1003",
      payment_method: "Bank Transfer",
      transaction_id: "BNK-4531KJL9",
      amount: 1399,
      status: "failed",
      processed_at: "2025-10-16T18:25:00Z",
    },
    {
      payment_id: "PAY-004",
      invoice_id: "INV-2025-1004",
      payment_method: "Cash",
      transaction_id: "CSH-PLN23981",
      amount: 2499,
      status: "completed",
      processed_at: "2025-10-17T11:50:00Z",
    },
  ];
  return (
    <div className="w-full flex flex-col  gap-6 ">
      <div className="w-full flex justify-end lg:justify-between">
        <p className="hidden lg:flex flex-col gap-1">
          <span className="text-2xl font-semibold">Payments Management</span>
          <span className="text-sm text-gray-500">Manage your payments</span>
        </p>

        <PrimaryButton text="Create Plan" icon={<BiPlusCircle size={20} />} />
      </div>

      <div className="mt-5">
        <StatsSection paymentsStats={paymentsStats} />
      </div>
      <div className="bg-white px-3 rounded-lg shadow-md py-3">
        <PaymentTable paymentDatas={paymentDatas} />
      </div>

      <div className="bg-white px-3 rounded-lg shadow-md py-3">
        <OverDueSection />
      </div>
    </div>
  );
}
