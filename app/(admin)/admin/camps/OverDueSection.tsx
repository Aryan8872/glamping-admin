import { SubscriptionStatus } from "@/types/SubscriptionTypes";
import OverdueTable from "./OverdueTable";

export default function OverDueSection() {
    const overdueDatas = [
        {
            overdue_id: "OD001",
            invoice_id: "INV-1001",
            subscription_plan: "Pro Plan",
            subscription_status: SubscriptionStatus.GracePeriod,
            user: {
                user_id: "USR-001",
                username: "john_doe",
                email: "john.doe@example.com",
                role: "customer",
                status: "active",
                phone_number: "+1 555-234-1234",
                created_at: "2024-05-12T10:32:00Z",
                updated_at: "2025-10-10T14:10:00Z",
            },
            amount_due: 49.99,
            due_date: "2025-10-15T00:00:00Z",
            days_overdue: 6,
            last_payment_date: "2025-09-15T00:00:00Z",
        },
        {
            overdue_id: "OD002",
            invoice_id: "INV-1002",
            subscription_plan: "Starter Plan",
            subscription_status: SubscriptionStatus.Overdue,
            user: {
                user_id: "USR-002",
                username: "emma_smith",
                email: "emma.smith@example.com",
                role: "customer",
                status: "active",
                phone_number: "+44 7894 223311",
                created_at: "2023-08-20T12:10:00Z",
                updated_at: "2025-09-29T18:20:00Z",
            },
            amount_due: 19.99,
            due_date: "2025-10-10T00:00:00Z",
            days_overdue: 11,
            last_payment_date: "2025-09-10T00:00:00Z",
        },
        {
            overdue_id: "OD003",
            invoice_id: "INV-1003",
            subscription_plan: "Business Plan",
            subscription_status: SubscriptionStatus.Expired,
            user: {
                user_id: "USR-003",
                username: "michael_lee",
                email: "michael.lee@example.com",
                role: "customer",
                status: "suspended",
                phone_number: "+1 213-555-9856",
                created_at: "2023-11-02T09:45:00Z",
                updated_at: "2025-10-05T11:15:00Z",
            },
            amount_due: 99.0,
            due_date: "2025-09-30T00:00:00Z",
            days_overdue: 21,
            last_payment_date: "2025-08-30T00:00:00Z",
        },
        {
            overdue_id: "OD004",
            invoice_id: "INV-1004",
            subscription_plan: "Pro Plan",
            subscription_status: SubscriptionStatus.GracePeriod,
            user: {
                user_id: "USR-004",
                username: "sophia_brown",
                email: "sophia.brown@example.com",
                role: "customer",
                status: "active",
                phone_number: "+61 412 993 221",
                created_at: "2024-03-10T08:00:00Z",
                updated_at: "2025-10-16T09:22:00Z",
            },
            amount_due: 49.99,
            due_date: "2025-10-17T00:00:00Z",
            days_overdue: 4,
            last_payment_date: "2025-09-17T00:00:00Z",
        },
        {
            overdue_id: "OD005",
            invoice_id: "INV-1005",
            subscription_plan: "Enterprise Plan",
            subscription_status: SubscriptionStatus.Overdue,
            user: {
                user_id: "USR-005",
                username: "daniel_kim",
                email: "daniel.kim@example.com",
                role: "customer",
                status: "active",
                phone_number: "+82 10-5678-9999",
                created_at: "2022-09-10T11:22:00Z",
                updated_at: "2025-10-18T15:45:00Z",
            },
            amount_due: 199.0,
            due_date: "2025-10-08T00:00:00Z",
            days_overdue: 13,
            last_payment_date: "2025-09-08T00:00:00Z",
        },
    ]
    return (
        <div className="w-full flex flex-col gap-3 px-3">
            <OverdueTable overdueDatas={overdueDatas} />
        </div>
    )
}