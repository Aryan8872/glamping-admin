export interface Plan{
    name:string;
    price:number;
    description:string;
    price_yearly:number;
    price_monthly:number;
    trial_days:number;
    features:string[];
    created_at:string;
    updated_at:string;
}