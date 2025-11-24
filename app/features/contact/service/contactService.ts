"use server";
import { revalidateTag } from "next/cache";
import { apiGetContact, apiUpdateContact } from "../api/contactApi";
import { CONTACT_TAG, Contact, ContactSchema } from "../types/contactTypes";

export async function getContactContent(): Promise<Contact> {
    try {
        const data = await apiGetContact();
        // If no data exists, return a default object or handle accordingly
        // Assuming backend returns the object or 404
        return data || { id: 1, email: "", phoneNumber: "", address: "" };
    } catch (error) {
        console.error("Error fetching contact:", error);
        // Return empty default to prevent crash if backend not ready
        return { id: 1, email: "", phoneNumber: "", address: "" };
    }
}

export async function updateContact(data: Partial<Contact>) {
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
        console.error(parsed.error);
        throw new Error("Validation failed");
    }

    const res = await apiUpdateContact(parsed.data);
    revalidateTag(CONTACT_TAG);
    return res;
}
