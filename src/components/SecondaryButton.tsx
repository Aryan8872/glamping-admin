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
      className={`bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap min-w-[120px] text-sm sm:text-base ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-xl">{icon}</span>}
      <span className="tracking-tight">{text}</span>
    </button>
  );
}
