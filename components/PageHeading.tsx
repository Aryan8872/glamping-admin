"use client"
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export function PageHeading({
  heading,
  subheading,
}: {
  heading: string;
  subheading?: string;
}) {
  const router  = useRouter()
  return (
    <div className="flex flex-col gap-4">
      <span onClick={()=>router.back()} className="flex gap-3 items-center font-medium cursor-pointer">
        <IoArrowBack size={30}/>
        Back
      </span>
      <p className="flex flex-col gap-1">
        <span className="font-montserrat text-2xl font-semibold">{heading}</span>
        {subheading && (
          <span className="text-sm font-inter text-gray-500">{subheading}</span>
        )}
      </p>
    </div>
  );
}
