export default function SecondaryButton({
  text,
  icon,
  onClick,
  className = "",
}: {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 font-inter font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap min-w-[100px] text-sm sm:text-base ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
    </button>
  );
}
