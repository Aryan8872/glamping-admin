import { Stat } from "../types/AboutUsTypes";
import StatsCard from "./StatsCard";

export default function StatsSection({ data }: { data: Stat[] }) {
  if (data.length == 0)
    return <span className=" text-gray-font">No stats</span>;
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-2">
      {data.map((stat, indx) => (
        <StatsCard stats={stat} key={indx} />
      ))}
    </div>
  );
}
