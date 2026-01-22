import { z } from "zod";
import { CampSite } from "../../camps/types/campTypes";

export interface Adventure {
    id: number;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    bannerImage: string;
    title: string;
    pageDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    campSites?: CampSiteAdventure[];
}

export interface CampSiteAdventure {
    id: number;
    campId: number;
    adventureId: number;
    campSite: CampSite;
    adventure?: Adventure;
}

export const CreateAdventureSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    coverImage: z.string().min(1, "Cover image is required"),
    bannerImage: z.string().min(1, "Banner image is required"),
    title: z.string().min(1, "Title is required"),
    pageDescription: z.string().min(1, "Page description is required"),
    isActive: z.boolean().optional().default(true),
});

export const UpdateAdventureSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    bannerImage: z.string().optional(),
    title: z.string().optional(),
    pageDescription: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const AssignAdventureSchema = z.object({
    adventureIds: z.array(z.number().int().positive()),
});

export type CreateAdventureValues = z.infer<typeof CreateAdventureSchema>;
export type UpdateAdventureValues = z.infer<typeof UpdateAdventureSchema>;
export type AssignAdventureValues = z.infer<typeof AssignAdventureSchema>;
