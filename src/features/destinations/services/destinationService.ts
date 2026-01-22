"use server";

import { revalidateTag } from "next/cache";
import * as destinationApi from "../api/destinationApi";

const DESTINATION_TAG = "destinations";

import { Destination } from "../types/destinationTypes";

export async function getAllDestinations(params: any = {}): Promise<{ data: Destination[], total: number, page: number, perPage: number }> {
    return await destinationApi.apiGetAllDestinations(params);
}

export async function getDestinationById(id: number) {
    return await destinationApi.apiGetDestinationById(id);
}

export async function createDestination(data: FormData) {
    const res = await destinationApi.apiCreateDestination(data);
    revalidateTag(DESTINATION_TAG, "max");
    return res;
}

export async function updateDestination(id: number, data: FormData) {
    const res = await destinationApi.apiUpdateDestination(id, data);
    revalidateTag(DESTINATION_TAG, "max");
    return res;
}

export async function deleteDestination(id: number) {
    const res = await destinationApi.apiDeleteDestination(id);
    revalidateTag(DESTINATION_TAG, "max");
    return res;
}
