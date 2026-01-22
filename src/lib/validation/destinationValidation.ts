import { z } from "zod";

export const destinationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export type DestinationFormData = z.infer<typeof destinationSchema>;
