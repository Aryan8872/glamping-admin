import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { CampSite } from "../types/campTypes";

export async function apiGetAllCamps() {
    const res = await HttpGet("camp/all");
    return res.data as CampSite[];
}

export async function apiGetCampById(id: number) {
    const res = await HttpGet(`camp/${id}`);
    return res.data as CampSite;
}

export async function apiCreateCamp(payload: FormData) {
    const res = await HttpPost("camp/new", payload);
    return res.data;
}

export async function apiUpdateCamp(id: number, payload: FormData) {
    const res = await HttpPatch(`camp/${id}`, payload);
    return res.data;
}

export async function apiDeleteCamp(id: number) {
    const res = await HttpDelete(`camp/${id}`);
    return res.data;
}
