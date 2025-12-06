"use server";
import { revalidateTag } from "next/cache";
import { apiGetContact, apiUpdateContact } from "../api/contactApi";
import { CONTACT_TAG, Contact, ContactSchema } from "../types/contactTypes";

import { apiWrapper } from "@/lib/apiWrapper";

export async function getContactContent(): Promise<Contact> {
    return apiWrapper(CONTACT_TAG, async () => {
        try {
            const data = await apiGetContact();
            return data || { id: 1, email: "", phoneNumber: "", address: "" };
        } catch (error) {
            console.error("Error fetching contact:", error);
            return { id: 1, email: "", phoneNumber: "", address: "" };
        }
    });
}

export async function updateContact(data: Partial<Contact>) {
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
        console.error(parsed.error);
        throw new Error("Validation failed");
    }

    const res = await apiWrapper(CONTACT_TAG, () => apiUpdateContact(parsed.data));
    (revalidateTag as any)(CONTACT_TAG);
    return res;
}
