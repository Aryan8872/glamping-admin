import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { Experience } from "../types/experienceTypes";

export async function apiGetAllExperiences() {
    const res = await HttpGet(`experience/all`);
    // Assuming backend returns { data: [...] } or [...] based on convention
    // In backend/modules/experiences/experienceController.js: res.status(200).json({ data: experiences });
    return (res as any).data as Experience[];
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
