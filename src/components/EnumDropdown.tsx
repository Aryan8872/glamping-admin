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
    <div className="relative w-full sm:w-auto">
      {/* Selected box */}
      <div
        className="border-slate-200 border bg-white px-4 py-3 min-w-[160px] font-semibold rounded-2xl cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:border-blue-400 hover:shadow-md transition-all active:scale-[0.98]"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2.5">
          {value && <span className="text-blue-600">{getIcon(value)}</span>}
          <span className="text-slate-700 text-sm whitespace-nowrap">
            {selectedLabel}
          </span>
        </div>
        {open ? (
          <FaChevronUp className="text-slate-400 text-xs" />
        ) : (
          <FaChevronDown className="text-slate-400 text-xs" />
        )}
      </div>

      {/* Dropdown menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 sm:right-auto sm:min-w-full z-50 bg-white border border-slate-100 rounded-2xl mt-2 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`px-4 py-3 text-sm font-semibold cursor-pointer flex items-center gap-3 transition-colors ${
                  value === opt.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
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
        </>
      )}
    </div>
  );
}
