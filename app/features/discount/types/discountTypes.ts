import { Adventure } from "../../adventures/types/adventureTypes";
import { CampSite } from "../../camps/types/campTypes";
import { z } from "zod";

export const DISCOUNT_API_KEY = "DISCOUNT"

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
    campId?: number | null;
    adventureId?: number | null;
    startsAt: string;
    endsAt: string
}

export const createDiscountSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    type: z.nativeEnum(DISCOUNT_TYPE),
    amount: z.coerce.number().positive("Amount must be positive"),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    isFeatured: z.boolean().optional(),
    campId: z.coerce.number().optional(),
    adventureId: z.coerce.number().optional(),
});

export type CreateDiscountDTO = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountDTO = Partial<CreateDiscountDTO>;
