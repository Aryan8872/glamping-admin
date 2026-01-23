import { z } from "zod";

export const CONTACT_TAG = "contact";

export interface Contact {
    id: number;
    email: string;
    phoneNumber: string;
    address: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
}

export const ContactSchema = z.object({
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    facebookUrl: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
    instagramUrl: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
    twitterUrl: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;
