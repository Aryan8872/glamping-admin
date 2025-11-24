export default function SecondaryButton({text,icon, onClick}: {text: string,icon?:React.ReactNode, onClick?: () => void}) {
    return (
        <button onClick={onClick} className="text-black font-montserrat border-[0.7px] border-gray-400 font-medium cursor-pointer h-max py-2 hover:bg-primary-blue/80 flex gap-2 items-center min-w-[80px]  px-2 sm:px-4  rounded-md">
            {icon}
            {text}
        </button>
    )
}
