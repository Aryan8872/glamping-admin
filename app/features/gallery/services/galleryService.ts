"use server"
import { revalidateTag } from "next/cache";
import { Gallery, GALLERY_KEY, GallerySchema } from "../types/galleryTypes";
import { apiCreateGallery, apiDeleteGallery, apiGetAllGallery, apiGetGalleryBySlug, apiUpdateGalleryStatus } from "../api/galleryApi";

export async function getGalleryList(): Promise<Gallery[]> {
  const items = await apiGetAllGallery();
  const parsed = GallerySchema.array().safeParse(items);
  if (!parsed.success) {
    console.log(parsed.error)
    return []
  }
  return parsed.data

}

export async function getGalleryDetail(slug: string): Promise<Gallery> {
  const item = await apiGetGalleryBySlug(slug);
  return GallerySchema.parse(item);
}

export async function createGallery(data: Partial<Gallery> | FormData) {
  console.log("service gallery",data)
  return await apiCreateGallery(data);
}
export async function deleteGallery(data: Partial<Gallery>) {
  return await apiDeleteGallery(data)
}
export async function updateGalleryStatus(slug: string, data: Partial<Gallery> | FormData) {
  const result = await apiUpdateGalleryStatus(slug, data);
  revalidateTag(`${GALLERY_KEY}-${slug}`, { expire: 0 }) //marks as stale immediately and immediately revalidates
  revalidateTag(GALLERY_KEY, "max") //revalidate in background 
  return result
}

// export async function deleteUser(id: number) {
//   return await apiDeletEu(id);
// }
