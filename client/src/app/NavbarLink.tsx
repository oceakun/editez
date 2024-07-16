import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarLink(props: { href: string; title: string; btnType:string }) {
  const pathName = usePathname();

  const inactiveNormalClasses = [
    "text-green-300",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "border-1 border-green-300",
    "dark:bg-[#090909]",
    "bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-400/10",
    "font-mono",
    "text-black",
  ];
  
  const inactiveSpecialClasses = [
    "text-green-300",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "dark:bg-[#090909]",
    "bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10",
    "font-mono",
    "text-black-500",
  ];

  const activeNormalClasses = [
    "text-green-300",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "dark:bg-[#090909]",
    "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400",

    "font-mono",
    "text-gray-950",
  ];

  const activeSpecialClasses = [
    "text-green-300",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400",
    "text-gray-950",
    "font-extrabold",
    "font-mono",
    "bg-black"
  ];

  const activeClasses = [
    "text-green-300",
    "hover:border-[#474648]",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "dark:bg-[#090909]",
  ];

  const inactiveClasses = [
    "text-green-300",
    "hover:border-[#474648]",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-4",
    "py-2",
    "text-center",
    "dark:bg-[#090909]",
  ];

  const isActive = pathName === props.href;
  const isSpecial = props.btnType === "special";

  return (
    <Link
      href={props.href}
      className={
        isActive
          ? isSpecial
            ? activeSpecialClasses.join(" ")
            : activeNormalClasses.join(" ")
          : isSpecial
            ? inactiveSpecialClasses.join(" ")
            : inactiveNormalClasses.join(" ")
      }
      // className={
      //   isActive?activeClasses.join(" "):inactiveClasses.join(" ")
      // }
      aria-current="page"
    >
      <span className={isActive ?(isSpecial?"text-black":"text-black") : "text-green"}>
        {props.title}
      </span>
    </Link>
  );
}
