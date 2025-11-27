"use server";
import { apiGetAllFacilities, apiCreateFacility, apiUpdateFacility, apiDeleteFacility, apiGetFacilityById } from "../api/facilityApi";
import { Facility } from "../../camps/types/campTypes";

export async function getAllFacilities() {
    return await apiGetAllFacilities();
}

export async function getFacilityById(id: number) {
    return await apiGetFacilityById(id);
}

export async function createFacility(data: Partial<Facility>) {
    return await apiCreateFacility(data);
}

export async function updateFacility(id: number, data: Partial<Facility>) {
    return await apiUpdateFacility(id, data);
}

export async function deleteFacility(id: number) {
    return await apiDeleteFacility(id);
}
