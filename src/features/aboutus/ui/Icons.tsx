import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";
import * as RiIcons from "react-icons/ri";

const allIcons = {
  ...BiIcons,
  ...MdIcons,
  ...FaIcons,
  ...IoIcons,
  ...AiIcons,
  ...BsIcons,
  ...HiIcons,
  ...RiIcons,
};

interface RenderIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export function RenderIcon({
  iconName,
  size = 24,
  className = "",
}: RenderIconProps) {
  const IconComponent = allIcons[iconName as keyof typeof allIcons];

  if (!IconComponent || typeof IconComponent !== "function") {
    return (
      <div
        className={`w-${size / 4} h-${
          size / 4
        } bg-gray-200 rounded ${className}`}
      />
    );
  }

  return <IconComponent size={size} className={className} />;
}

export { allIcons };
