"use client"
import { PageHeading } from "@/components/PageHeading";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import { useConfirm } from "@/stores/useConfirm";
import { useState } from "react";
import { PiPlus } from "react-icons/pi";
import AddGallery from "./AddGallery";

export default function GalleryHeader() {
    const [showModal,setShowModal] = useState(false)
    // const modal = useConfirm((s)=>s.)
  return (
    <>
    <div className="w-full flex justify-between">
      <PageHeading heading="Gallery" subheading="Manage Gallery" />
      <PrimaryFilledButton  onClick={()=>setShowModal(!showModal)} text="Add Gallery" icon={<PiPlus />} />
    </div>
    {
        showModal && <AddGallery/>
    }
    </>
  );
}
