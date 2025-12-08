import { HttpGet, HttpPost, HttpPut, HttpDelete, HttpPatch } from "@/lib/http/http";
import { Adventure, CreateAdventureValues, UpdateAdventureValues } from "../types/adventureTypes";

export async function apiGetAllAdventures(includeInactive = false) {
    const query = includeInactive ? "?includeInactive=true" : "";
    const res = await HttpGet(`adventure/all`);
    console.log(res.data)
    return res.data as Adventure[];
}

export async function apiGetAdventureById(id: number) {
    const res = await HttpGet(`adventure/${id}`);
    return res.data as Adventure;
}

export async function apiGetAdventureBySlug(slug: string) {
    const res = await HttpGet(`adventure/slug/${slug}`);
    return res.data as Adventure;
}

export async function apiCreateAdventure(payload: FormData) {
    const res = await HttpPost("adventure/new", payload);
    return res.data as Adventure;
}

export async function apiUpdateAdventure(id: number, payload: FormData) {
    console.log("adventure update data", payload)
    const res = await HttpPatch(`adventure/update/${id}`, payload);
    console.log(res.data)
    return res.data as Adventure;
}

export async function apiDeleteAdventure(id: number) {
    const res = await HttpDelete(`adventure/delete/${id}`);
    return res.data;
}

export async function apiAssignAdventuresToCamp(campId: number, adventureIds: number[]) {
    const res = await HttpPost(`adventure/assign/${campId}`, { adventureIds });
    return res.data;
}
