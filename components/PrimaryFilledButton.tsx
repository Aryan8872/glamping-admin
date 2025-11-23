export default function PrimaryFilledButton({text,icon}: {text: string,icon?:React.ReactNode}) {
    return (
        <button className="bg-primary-blue font-medium cursor-pointer h-max py-2 hover:bg-primary-blue/80 flex gap-2 items-center min-w-[80px]  px-2 sm:px-4 text-white rounded-md">
            {icon}
            {text}
        </button>
    )
}
