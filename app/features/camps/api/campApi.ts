import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { CampSite } from "../types/campTypes";

export async function apiGetAllCamps() {
    const res = await HttpGet("campsite/all");
    return res.data as CampSite[];
}

export async function apiGetCampById(id: number) {
    const res = await HttpGet(`campsite/${id}`);
    return res.data as CampSite;
}

export async function apiCreateCamp(payload: FormData) {
    const res = await HttpPost("campsite/new", payload);
    return res.data;
}

export async function apiUpdateCamp(id: number, payload: FormData) {
    const res = await HttpPatch(`campsite/${id}`, payload);
    return res.data;
}

export async function apiDeleteCamp(id: number) {
    const res = await HttpDelete(`campsite/${id}`);
    return res.data;
}


export async function apiGetCampHosts(){
    const res = await HttpGet("user/camphosts");
    return res.data ;
}