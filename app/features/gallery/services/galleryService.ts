import { Gallery, GallerySchema } from "../types/galleryTypes";
import { apiGetAllGallery, apiGetGalleryBySlug } from "../api/galleryApi";

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
