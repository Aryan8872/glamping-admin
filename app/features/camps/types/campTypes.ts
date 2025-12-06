import { z } from "zod";
import { Discount } from "../../discount/types/discountTypes";
import { Adventure } from "../../adventures/types/adventureTypes";

export interface CampSite {
    id: number;
    name: string;
    description: string;
    slug: string;
    images: string[];
    pricePerNight: number;
    createdAt: string;
    updatedAt: string;
    campSiteFacilities: CampSiteFacility[];
    campHost?: {
        id: number;
        fullName: string;
        email: string;
        userType: string;
    };
    hostId?: number | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    adventures?: CampAdventure[];
    discounts?: Discount[]
}

export interface CampAdventure {
    id: number;
    campId: number;
    adventureId: number;
    adventure: {
        id: number;
        name: string;
        coverImage: string;
    } | Adventure;
    discounts?: Discount[]
}

export interface Facility {
    id: number;
    name: string;
    icon: string;
    slug: string;
}

export interface CampSiteFacility {
    id: number;
    campId: number;
    facilityId: number;
    facility: Facility;
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
