import { z } from "zod";

export const campSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    pricePerNight: z.coerce.number().min(0.01, "Price is required and must be greater than 0"),
    location: z.string().min(1, "Location is required"),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    hostId: z.coerce.number().optional(),
    maxAdult: z.coerce.number().min(0, "Cannot be negative").optional(),
    maxChildren: z.coerce.number().min(0, "Cannot be negative").optional(),
    maxPets: z.coerce.number().min(0, "Cannot be negative").optional(),
    isFeatured: z.boolean().optional(),
    destinationId: z.coerce.number().optional(),
});

export type CampFormData = z.infer<typeof campSchema>;
