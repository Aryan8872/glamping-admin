import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";


type DropMenuItem = {
  label: string;
  link: string;
};

type DropMenuItems = DropMenuItem[];

export function DropMenuButton({
  buttonLabel,
  items,
}: {
  buttonLabel: string;
  items: DropMenuItems;
}) {
  return (
    <div className="relative group">
      <button className="flex gap-2 cursor-pointer  items-center capitalize font-medium">
        {buttonLabel} <FaChevronDown size={12} />
      </button>
        <section className="opacity-0 absolute px-5 py-4 flex  gap-8 group-hover:opacity-100 transition-opacity duration-300 ease-in-out shadow-md rounded-md min-h-20 min-w-52">
            {
                items.map((item,idx)=>(
                    <Link href={item.link} className="capitalize text-sm font-medium" key={idx}>
                        {item.label}
                    </Link>
                ))
            }
      </section>
    </div>
  );
}
