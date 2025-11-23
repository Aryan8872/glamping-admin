"use client";
import { IoOptions } from "react-icons/io5";
import { Stat } from "../types/AboutUsTypes";
import { IconsData } from "./Icons";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { updateStats, deleteStats } from "../service/aboutUsService";
import { TiTick } from "react-icons/ti";
import { CgClose } from "react-icons/cg";
import { useConfirm } from "@/stores/useConfirm";
import { useRouter } from "next/navigation";

export default function StatsCard({ stats }: { stats: Stat }) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter()
  const [editedStats, setEditedStats] = useState({});
  const IconComponent = IconsData[stats.icon];

  const confirm = useConfirm((s) => s.confirm);

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStats((prev) => ({ ...prev, [name]: value }));
  };

  const updatestat = async () => {
    await updateStats(stats.id, editedStats);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const ok = await confirm("Delete this stats item?");

    if (!ok) return;

    await deleteStats(stats.id);
    router.refresh()
  };

  return isEditing ? (
    <div className="relative w-full h-full space-y-2">
      <input onChange={handleEdit} name="heading" defaultValue={stats.heading} />
      <input onChange={handleEdit} name="value" defaultValue={stats.value} />

      <div className="flex flex-row gap-3 absolute top-2 items-center right-3">
        <button
          onClick={updatestat}
          className="flex flex-row gap-2 cursor-pointer group items-center bg-primary-blue rounded-lg p-2 text-white"
        >
          <TiTick />
        </button>

        <button
          onClick={() => setIsEditing(false)}
          className="flex flex-row gap-2 cursor-pointer group items-center bg-primary-blue rounded-lg p-2 text-white"
        >
          <CgClose className="group-hover:text-red-500" />
        </button>
      </div>
    </div>
  ) : (
    <div className="h-full relative w-full grid grid-rows-subgrid row-span-3 text-center rounded-lg p-2 shadow-md overflow-hidden">
      {IconComponent && (
        <div className="place-self-center">
          <IconComponent size={32} />
        </div>
      )}

      <h1 className="text-lg min-w-0 font-medium break-words">{stats.heading}</h1>
      <p className="text-gray-font min-w-0 break-words">{stats.value}</p>

      <div className="flex flex-row gap-3 absolute right-3">
        <button
          onClick={() => setIsEditing(true)}
          className="flex flex-row gap-2 cursor-pointer group items-center bg-primary-blue rounded-lg p-2 text-white"
        >
          <IoOptions />
        </button>

        <button
          onClick={handleDelete}
          className="flex flex-row gap-2 cursor-pointer group items-center bg-primary-blue rounded-lg p-2 text-white"
        >
          <MdDelete className="group-hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}
