import { z } from "zod";

export const experienceSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title too long"),
    slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    isActive: z.boolean().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
