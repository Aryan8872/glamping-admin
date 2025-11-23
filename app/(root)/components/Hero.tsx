import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import Image from "next/image";


export default function Hero() {
  return (
    <div className="relative grid grid-cols-1 h-[90vh] items-center gap-x-5 gap-y-5 lg:grid-cols-[40%_60%] ">

      <div className="flex flex-col gap-6">
        <p className="text-5xl md:text-6xl flex flex-col gap-3">
          <span className="font-light tracking-wide">Streamline Sales,</span>
          <span className="font-medium tracking-wide">Maximize Growth</span>
        </p>

        <p className="text-gray-500 w-[80%]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam sit
          fugiat necessitatibus nesciunt quo itaque animi unde distinctio
          aliquid earum. Amet ullam, est culpa distinctio doloribus corporis
          optio numquam. Consequatur?
        </p>
        <div className="flex gap-3">
            <PrimaryFilledButton text="Request a demo"/>
            <SecondaryButton text="Watch Demo"/>
        </div>
      </div>

      <div className="hidden lg:block relative h-[400px] lg:h-[600px] w-auto">
        <Image fill alt="Hero image" src={"/image.png"} className="h-full w-full object-contain"/>
      </div>
    </div>
  );
}
