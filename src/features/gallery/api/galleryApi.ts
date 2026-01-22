import { HttpGet, HttpPatch, HttpPost, HttpPut, HttpDelete } from "@/lib/http/http"
import { Gallery, GALLERY_BY_SLUG, GALLERY_KEY } from "../types/galleryTypes"


export async function apiGetAllGallery(params: any = {}): Promise<{ data: Gallery[], total: number, page: number, perPage: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const res = await HttpGet(`gallery/all?${query.toString()}`);
    return res;
}

export async function apiGetGalleryBySlug(slug: string): Promise<Gallery> {
    const tag = GALLERY_BY_SLUG(slug)
    const res = await HttpGet(`gallery/${slug}`, { next: { tags: [tag] } });
    return res.data;
}

export async function apiCreateGallery(payload: FormData) {
    const res = await HttpPost("gallery/new", payload);
    return res.data;
}

export async function apiUpdateGallery(slug: string, payload: FormData) {
    const res = await HttpPut(`gallery/${slug}`, payload);
    return res.data;
}

export async function apiDeleteGallery(galleryId: number) {
    const res = await HttpDelete(`gallery/${galleryId}`);
    return res.data;
}
