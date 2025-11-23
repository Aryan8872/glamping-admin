import PrimaryButton from "@/components/PrimaryFilledButton";
import PlanTable from "./PlanTable";
import { FaUserPlus } from "react-icons/fa";
import { BiPlus, BiPlusCircle } from "react-icons/bi";
import { PageHeading } from "@/components/PageHeading";

export default function Plans() {
  const planDatas = [
    {
      name: "Basic Connect",
      price: 499,
      description:
        "Affordable home internet for light users — ideal for browsing, emails, and social media.",
      price_yearly: 5499,
      price_monthly: 499,
      trial_days: 7,
      features: [
        "Speed up to 25 Mbps",
        "Unlimited data (Fair Usage Policy applies)",
        "Free installation",
        "24/7 customer support",
      ],
      created_at: "2025-01-05T09:00:00Z",
      updated_at: "2025-09-10T15:30:00Z",
    },
    {
      name: "Family Plus",
      price: 899,
      description:
        "Reliable and fast Wi-Fi for families — perfect for HD streaming, video calls, and online classes.",
      price_yearly: 9999,
      price_monthly: 899,
      trial_days: 10,
      features: [
        "Speed up to 75 Mbps",
        "Unlimited data",
        "Dual-band Wi-Fi router included",
        "Parental control access",
        "Priority support",
      ],
      created_at: "2025-02-15T11:20:00Z",
      updated_at: "2025-09-20T14:40:00Z",
    },
    {
      name: "Pro Stream",
      price: 1399,
      description:
        "High-speed plan built for gamers, streamers, and small offices needing stable connectivity.",
      price_yearly: 15499,
      price_monthly: 1399,
      trial_days: 14,
      features: [
        "Speed up to 150 Mbps",
        "Unlimited data with high FUP limit",
        "Free dual-band router",
        "Low latency optimized for gaming",
        "Static IP available on request",
      ],
      created_at: "2025-03-22T10:10:00Z",
      updated_at: "2025-09-30T09:45:00Z",
    },
    {
      name: "Enterprise Ultra",
      price: 2499,
      description:
        "Dedicated business-grade internet for enterprises with guaranteed uptime and priority support.",
      price_yearly: 27499,
      price_monthly: 2499,
      trial_days: 30,
      features: [
        "Speed up to 300 Mbps",
        "Dedicated bandwidth (1:1 ratio)",
        "24/7 enterprise support",
        "Free static IP",
        "Service Level Agreement (99.9% uptime)",
      ],
      created_at: "2025-04-01T08:00:00Z",
      updated_at: "2025-10-01T17:00:00Z",
    },
  ];
  return (
    <div className="h-screen w-full">
      <div className="w-full flex justify-between">
     
        <PageHeading heading="Plan Management" subheading="Manage your plans"/>

        <PrimaryButton text="Create Plan" icon={<BiPlusCircle size={20} />} />
      </div>
      <div>
        <PlanTable planDatas={planDatas} />
      </div>
    </div>
  );
}
