import { HttpGet, HttpPost, HttpPatch, HttpDelete } from "@/lib/http/http";
import { Destination } from "../types/destinationTypes";

export async function apiGetAllDestinations() {
    const res = await HttpGet(`destination/all`);
    return (res as any).data as Destination[];
}

export async function apiGetDestinationById(id: number) {
    const res = await HttpGet(`destination/${id}`);
    return (res as any).data as Destination;
}

export async function apiCreateDestination(payload: FormData) {
    const res = await HttpPost("destination/new", payload);
    return (res as any).data as Destination;
}

export async function apiUpdateDestination(id: number, payload: FormData) {
    const res = await HttpPatch(`destination/update/${id}`, payload);
    return (res as any).data as Destination;
}

export async function apiDeleteDestination(id: number) {
    const res = await HttpDelete(`destination/delete/${id}`);
    return (res as any).data;
}
