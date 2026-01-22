export interface Payments {
    payment_id:string;
    invoice_id:string;
    payment_method:string;
    transaction_id:string;
    amount:number;
    status:string;
    processed_at:string;
}

export interface PaymentsStats{
    TotalRevenue:{value:number,change:string, changetype:boolean},
    OverduePayments:{value:number,change:string, changetype:boolean},
    UpcomingRenewals:{value:number,change:string, changetype:boolean},
    NewSubscriptions:{value:number,change:string, changetype:boolean},
}