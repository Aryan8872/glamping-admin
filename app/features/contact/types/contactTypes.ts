import { z } from "zod";

export const CONTACT_TAG = "contact";

export interface Contact {
    id: number;
    email: string;
    phoneNumber: string;
    address: string;
}

export const ContactSchema = z.object({
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;
