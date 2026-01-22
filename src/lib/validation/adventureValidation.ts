import { z } from "zod";

export const adventureSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title too long"),
    pageDescription: z.string().min(10, "Page description must be at least 10 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
    isActive: z.boolean().optional(),
});

export type AdventureFormData = z.infer<typeof adventureSchema>;
