import { getGalleryDetail } from "@/app/features/gallery/services/galleryService";
import EditGallery from "@/app/features/gallery/ui/EditGallery";
import { NextPageContext } from "next";

export default async function page({params}:{params:Promise<{slug:string}>}){
    const slug = (await params).slug
    const galleryData = await getGalleryDetail(slug)
    return(
      <EditGallery galleryData={galleryData}/>
    )
}