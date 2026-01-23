export default function PrimaryFilledButton({
  text,
  icon,
  onClick,
  disabled,
  className = "",
}: {
  text: string;
  icon?: React.ReactNode;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-inter font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap min-w-[100px] text-sm sm:text-base ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
    </button>
  );
}
