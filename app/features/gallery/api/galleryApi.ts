import { HttpGet, HttpPatch, HttpPost } from "@/lib/http/http"
import { Gallery, GALLERY_BY_SLUG, GALLERY_KEY } from "../types/galleryTypes"


export async function apiGetAllGallery(): Promise<Gallery[]> {
    const res = await HttpGet(`gallery/all`, {
        next: {
            tags: [GALLERY_KEY]
        }
    })
    // const responseSchema = z.object({
    //     message: z.string(),
    //     data: z.array(GalleryItemSchema),
    // });
    // console.log(res.data)

    // const validated = responseSchema.safeParse(json);
    // if (!validated.success) {
    //     console.error("Zod validation error:", validated.error.format());
    //     return [];
    // }

    // return validated.data.data;
    return res.data
}

export async function apiGetGalleryBySlug(slug: string): Promise<Gallery> {
    const tag = GALLERY_BY_SLUG(slug)
    const res = await HttpGet(`gallery/${slug}`, { next: { tags: [tag] } });
    return res.data;
}


export async function apiCreateGallery(payload: Partial<Gallery> |FormData) {
    const res = await HttpPost("gallery/new", payload);
    console.log(payload)
    return res.data;
}

export async function apiDeleteGallery(data: Partial<Gallery>) {
    await HttpPatch(`gallery/delete/${data.id}`)
}
export async function apiUpdateGalleryStatus(
    slug: string,
    payload: Partial<Gallery> | FormData
) {
    const res = await HttpPatch(`gallery/update/${slug}`, payload);
    return res.data;
}
