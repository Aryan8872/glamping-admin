import { getGalleryList } from "@/app/features/gallery/services/galleryService";
import GalleryGrid from "@/app/features/gallery/ui/GalleryGrid";
import { PageHeading } from "@/components/PageHeading";

export default async function page() {
  const galleryData = await getGalleryList();
  return (
    <div className="min-h-screen">
      <PageHeading heading="Gallery" subheading="Manage Gallery" />
      <GalleryGrid galleryData={galleryData} />
    </div>
  );
}
