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
      className={`bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap min-w-[120px] text-sm sm:text-base border border-blue-400/20 ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-xl">{icon}</span>}
      <span className="tracking-tight">{text}</span>
    </button>
  );
}
