export default function PrimaryFilledButton({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-primary-blue font-montserrat font-medium cursor-pointer h-max py-2 hover:bg-primary-blue/80 flex gap-2 items-center min-w-[80px]  px-2 sm:px-4 text-white rounded-md"
    >
      {icon}
      {text}
    </button>
  );
}
