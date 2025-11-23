import { HttpDelete, HttpGet, HttpPatch, HttpPost } from "@/lib/http/http"
import { ABOUT_US_TAG, AboutUs, Stat } from "../types/AboutUsTypes"
import { revalidateTag } from "next/cache"


export async function apiGetAboutUs(): Promise<AboutUs> {
    const res = await HttpGet(`about/all`, {
        next: {
            tags: [ABOUT_US_TAG]
        }
    })
    console.log(res.data)
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

export async function apiCreateAboutUs(payload: Partial<AboutUs>) {
    const res = await HttpPost("about/new", payload);
    return res.data;
}
export async function apiUpdateAboutUs(
    payload: Partial<AboutUs>
) {
    const res = await HttpPatch(`about/update`, payload);
    return res.data;
}
export async function apiDeleteStats(id: number) {
    return await HttpDelete(`stat/delete/${id}`)
}
export async function apiUpdateStats(id: number, payload: Partial<Stat
>) {
    const res = await HttpPatch(`stat/update/${id}`, payload)
    return res.data
}