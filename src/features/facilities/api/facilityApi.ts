import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { Facility } from "../../camps/types/campTypes";

export async function apiGetAllFacilities() {
    const res = await HttpGet("facility/all");
    return res.data as Facility[];
}

export async function apiGetFacilityById(id: number) {
    const res = await HttpGet(`facility/${id}`);
    return res.data as Facility;
}

export async function apiCreateFacility(payload: Partial<Facility>) {
    const res = await HttpPost("facility/new", payload);
    return res.data;
}

export async function apiUpdateFacility(id: number, payload: Partial<Facility>) {
    const res = await HttpPatch(`facility/${id}`, payload);
    return res.data;
}

export async function apiDeleteFacility(id: number) {
    const res = await HttpDelete(`facility/${id}`);
    return res.data;
}
