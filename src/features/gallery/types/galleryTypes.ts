import z from "zod";


export type GalleryTextField =
    | "title"
    | "description"
    | "excerpt"
    | "metaTitle"
    | "metaDescription"
    | "metaKeywords"
    | "imageAlt"
    | "galleryStatus";

export type State = {
    title: string;
    description: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    imageAlt: string;
    galleryStatus: string;
    images: string[];
    newImagesForBackend: File[];
    coverImage?: File | null;
};

export const MAX_GALLERY_IMAGES = 10
export const GALLERY_KEY = "gallery"
export const GALLERY_BY_SLUG = (slug: string) => {
    return `${GALLERY_KEY}-${slug}`
}
export enum GALLERY_STATUS {
    PUBLISHED = "PUBLISHED",
    DRAFT = "DRAFT",
    DELETED = "DELETED"
}
export interface Gallery {
    id: number,
    title: string,
    description: string,
    excerpt: string,
    images: string[],
    coverImage: string,
    slug: string,
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
    galleryStatus: GALLERY_STATUS
    imageAlt?: string
    createdAt?: string
    updatedAt?: string
}

export const GallerySchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    images: z.array(z.string()),
    coverImage: z.string(),
    slug: z.string(),
    metaTitle: z.any().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    galleryStatus: z.enum(GALLERY_STATUS),
    imageAlt: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
});
export const updateGallerySchema = GallerySchema.partial()
