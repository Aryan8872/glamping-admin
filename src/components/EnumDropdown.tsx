import { useState } from "react";
import { ReactElement } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export type EnumDropdownIconType = {
  value: string | number;
  icon: ReactElement;
};

export interface EnumDropdownProps<T extends string | number> {
  options: { label: string; value: T }[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  iconMap?: EnumDropdownIconType[];
}

export function EnumDropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  iconMap = [],
}: EnumDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const getIcon = (val: T) =>
    iconMap.find((i) => i.value === val)?.icon ?? null;

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div className="relative">
      {/* Selected box */}
      <div
        className="border-[1.8px] border-gray-300 relative px-2 max-w-[180px] py-2 font-medium rounded cursor-pointer flex items-center gap-2"
        onClick={() => setOpen((o) => !o)}
      >
        {value && getIcon(value)}
        <span>{selectedLabel}</span>
        {open ? (
          <FaChevronUp className="absolute right-3" />
        ) : (
          <FaChevronDown className="absolute right-3" />
        )}
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-10  border-none rounded mt-1  shadow-md">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-3 py-2   font-medium bg-gray-200 text-options-font-blue cursor-pointer flex items-center gap-2"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {getIcon(opt.value)}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
