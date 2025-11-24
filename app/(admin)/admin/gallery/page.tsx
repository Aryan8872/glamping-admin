import { getGalleryList } from "@/app/features/gallery/services/galleryService";
import GalleryGrid from "@/app/features/gallery/ui/GalleryGrid";
import GalleryHeader from "@/app/features/gallery/ui/GalleryHeader";


export default async function page() {
  const galleryData = await getGalleryList();
  return (
    <div className="min-h-screen">
      <div className="flex w-full justify-between">
        <GalleryHeader/>
      </div>
      <GalleryGrid galleryData={galleryData} />
    </div>
  );
}
