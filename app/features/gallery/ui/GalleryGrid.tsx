"use client";
import Link from "next/link";
import { Gallery, GALLERY_STATUS } from "../types/galleryTypes";
import { motion } from "framer-motion";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { MdDelete, MdEdit } from "react-icons/md";
import { useConfirm } from "@/stores/useConfirm";
import { deleteGallery } from "../services/galleryService";
import { useRouter } from "next/navigation";

export default function GalleryGrid({
  galleryData,
}: {
  galleryData: Gallery[];
}) {
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25, delay: 0.45 } },
  };
  const gridSquareVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const confirm = useConfirm((s) => s.confirm);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const ok = await confirm("Delete this Gallery?");
    if (!ok) return;
    await deleteGallery({ id: id });
    router.refresh();
  };

  return (
    <>
      <motion.p
        className="font-bold font-montserrat uppercase tracking-[.3em] text-3xl text-black text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        GALLERY
      </motion.p>
      <motion.section
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 grid-rows-[1fr_auto_auto_auto] sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
      >
        {galleryData.map((gallery) => (
          <div className="grid grid-rows-subgrid row-span-4 gap-2 rounded-md p-2 shadow-md">
            <Link
              href={`/admin/gallery/${gallery.slug}`}
              key={gallery.slug}
              className="group  relative aspect-[2/2.5]  overflow-hidden rounded-md"
            >
              <motion.div
                variants={gridSquareVariants}
                className="relative h-full rounded-md"
              >
                <div
                  className={`${
                    (gallery.galleryStatus === GALLERY_STATUS.DELETED &&
                      "bg-red-400 text-white") ||
                    (gallery.galleryStatus === GALLERY_STATUS.DRAFT &&
                      "bg-primary-blue text-white") ||
                    (gallery.galleryStatus == GALLERY_STATUS.PUBLISHED &&
                      "bg-green-400 text-white")
                  } rounded-md px-2 py-1 z-[60] shadow-md text-sm font-inter font-medium absolute top-2 right-3`}
                >
                  {gallery.galleryStatus}
                </div>
                <motion.img
                  src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${gallery.coverImage}`}
                  alt={gallery.title}
                  className="h-full w-full object-cover rounded-md transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 rounded-md"></div>
                <div className="absolute bottom-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all ease-out duration-500 w-full px-4 pb-6 text-center text-white">
                  <h3 className="text-lg font-bold font-montserrat uppercase tracking-wide mb-2">
                    {gallery.title}
                  </h3>
                  <p className="text-sm font-inter opacity-90 leading-snug">
                    {gallery.excerpt}
                  </p>
                </div>
              </motion.div>
            </Link>
            <h1 className="font-semibold font-montserrat">{gallery.title}</h1>
            <h2 className="text-[15px] text-gray-500 font-inter">
              {gallery.excerpt}
            </h2>

            <section className="flex flex-row gap-2 mt-3">
              <Link href={`/admin/gallery/${gallery.slug}`}>
                <PrimaryFilledButton
                  text="Edit"
                  icon={<MdEdit />}
                  onClick={() => {}}
                />
              </Link>

              <div className="" onClick={() => handleDelete(gallery.id)}>
                <SecondaryButton
                  text="Delete"
                  icon={<MdDelete color="red" />}
                />
              </div>
            </section>
          </div>
        ))}
      </motion.section>
    </>
  );
}
