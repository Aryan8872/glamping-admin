'use cache'
import { DropMenuButton } from "@/components/DropMenuButton";
import PrimaryButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import Image from "next/image";
import Link from "next/link";


export default async function NavBar() {
  const links = [
    {
      label: "Home",
      link: "/",
      dropdown: false,
      dropdownValues: [],
    },
    {
      label: "features",
      link: "/",
      dropdown: true,
      dropdownValues: [
        {label:"feature3",link:"/feature3"}, 
        {label:"feature3",link:"/feature3"}, 
        {label:"feature3",link:"/feature3"}],
    },
    {
      label: "pricing",
      link: "/pricing",
      dropdown: false,
      dropdownValues: [],
    },
    {
      label: "blogs",
      link: "/blogs",
      dropdown: false,
      dropdownValues: [],
    },
    {
      label: "contact",
      link: "/contact",
      dropdown: false,
      dropdownValues: [],
    },
  ];
  return (
    <div className="flex w-full items-center pt-7   justify-between">
      <Image
        src={"/netwavelogo.png"}
        height={60}
        width={130}
        alt="SAAS-BILLING-LOGO"
      />
      <section className="hidden  lg:flex gap-10">
        {links.map((link, index) =>
          link.dropdown ? (
            <DropMenuButton key={index} buttonLabel={link.label} items={link.dropdownValues}/>
          ) : (
            <Link
            key={index}
              className="capitalize font-inter text-[15px] font-medium"
              href={link.link}
            >
              {link.label}
            </Link>
          )
        )}
      </section>

      <div className="flex gap-3">
        <SecondaryButton text="Contact Sales" />
        <PrimaryButton text="Sign Up" />
      </div>
    </div>
  );
}
