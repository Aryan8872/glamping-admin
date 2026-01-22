import { z } from "zod";
import { DISCOUNT_TYPE } from "../../features/discount/types/discountTypes";

export const discountSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    type: z.nativeEnum(DISCOUNT_TYPE, { message: "Type must be PERCENTAGE or FIXED" }),
    amount: z.coerce.number().positive("Amount must be positive").max(100000, "Amount too high"),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().optional(),
    active: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    campId: z.coerce.number().optional(),
    adventureId: z.coerce.number().optional(),
});

export type DiscountFormData = z.infer<typeof discountSchema>;
