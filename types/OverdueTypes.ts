import { SubscriptionStatus } from "./SubscriptionTypes";
import { User } from "../app/features/users/types/UserTypes";

export interface Overdue {
    overdue_id: string;
    invoice_id: string;
    subscription_plan: string;
    subscription_status: SubscriptionStatus,
    user: User;
    amount_due: number;
    due_date: string;
    days_overdue: number;
    last_payment_date: string;

}