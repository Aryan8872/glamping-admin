import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { Experience } from "../types/experienceTypes";

export async function apiGetAllExperiences(params: any = {}): Promise<{ data: Experience[], total: number, page: number, perPage: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const res = await HttpGet(`experience/all?${query.toString()}`);
    return res;
}

export async function apiGetExperienceById(id: number) {
    const res = await HttpGet(`experience/${id}`);
    return (res as any).data as Experience;
}

export async function apiCreateExperience(payload: FormData) {
    const res = await HttpPost("experience/new", payload);
    return (res as any).data as Experience;
}

export async function apiUpdateExperience(id: number, payload: FormData) {
    const res = await HttpPatch(`experience/update/${id}`, payload);
    return (res as any).data as Experience;
}

export async function apiDeleteExperience(id: number) {
    const res = await HttpDelete(`experience/delete/${id}`);
    return (res as any).data;
}
