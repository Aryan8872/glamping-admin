import { getCampById } from "@/features/camps/services/campService";
import EditCamp from "@/features/camps/ui/EditCamp";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const campData = await getCampById(parseInt(id));
  return <EditCamp campData={campData} />;
}
