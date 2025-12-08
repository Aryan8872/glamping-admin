"use server";

import { revalidateTag } from "next/cache";
import * as destinationApi from "../api/destinationApi";

const DESTINATION_TAG = "destinations";

export async function getAllDestinations() {
    return await destinationApi.apiGetAllDestinations();
}

export async function getDestinationById(id: number) {
    return await destinationApi.apiGetDestinationById(id);
}

export async function createDestination(data: FormData) {
    const res = await destinationApi.apiCreateDestination(data);
    revalidateTag(DESTINATION_TAG);
    return res;
}

export async function updateDestination(id: number, data: FormData) {
    const res = await destinationApi.apiUpdateDestination(id, data);
    revalidateTag(DESTINATION_TAG);
    return res;
}

export async function deleteDestination(id: number) {
    const res = await destinationApi.apiDeleteDestination(id);
    revalidateTag(DESTINATION_TAG);
    return res;
}
