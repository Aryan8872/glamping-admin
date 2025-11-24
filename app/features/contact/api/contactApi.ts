import { HttpGet, HttpPatch, HttpPost } from "@/lib/http/http";
import { Contact } from "../types/contactTypes";

export async function apiGetContact() {
    const res = await HttpGet("contact");
    return res.data as Contact;
}

export async function apiUpdateContact(data: Partial<Contact>) {
    const res = await HttpPatch("contact", data);
    return res.data;
}

// In case it doesn't exist yet
export async function apiCreateContact(data: Partial<Contact>) {
    const res = await HttpPost("contact", data);
    return res.data;
}
