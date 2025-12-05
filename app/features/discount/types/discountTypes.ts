import { Adventure } from "../../adventures/types/adventureTypes";
import { CampSite } from "../../camps/types/campTypes";

export enum DISCOUNT_TYPE { PERCENTAGE = "PERCENTAGE", FIXED = "FIXED" }

export interface Discount {
    id: number,
    name: string;
    description: string;
    type: DISCOUNT_TYPE;
    amount: number;
    active: boolean;
    isFeatured: boolean;
    camp?: CampSite[]
    adventure?: Adventure[]
    startsAt: string;
    endsAt: string
}