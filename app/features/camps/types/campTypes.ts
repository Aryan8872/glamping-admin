import { z } from "zod";

export interface CampSite {
    id: number;
    name: string;
    description: string;
    slug: string;
    images: string[];
    pricePerNight: number;
    createdAt: string;
    updatedAt: string;
}

export const CampSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    pricePerNight: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)), "Price must be a number"),
});


export const CAMPS_KEY = "camps";

export type CampFormValues = z.infer<typeof CampSchema>;

export interface CampFormData extends CampFormValues {
    images: string[]; // Preview URLs
    newImagesForBackend: File[];
}

export interface CampApiResponse {
    data: CampSite[];
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}
