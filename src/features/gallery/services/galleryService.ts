import { Gallery, GallerySchema } from "../types/galleryTypes";
import { apiGetAllGallery, apiGetGalleryBySlug } from "../api/galleryApi";

export async function getGalleryList(params: any = {}): Promise<{ data: Gallery[], total: number, page: number, perPage: number }> {
  return await apiGetAllGallery(params);
}

export async function getGalleryDetail(slug: string): Promise<Gallery> {
  const item = await apiGetGalleryBySlug(slug);
  return GallerySchema.parse(item);
}
