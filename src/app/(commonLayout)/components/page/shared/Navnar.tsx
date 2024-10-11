"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Cog } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
// import { ThemeSwitcher } from "./ThemeSwitcher";
import { getUser } from "@/services";
export default function NavBar() {
  const routeMap: Record<string, string> = {
    user: "/dashboard",
    admin: "/dashboard/admin",
    driver: "/dashboard/driver",
  };

  const user = getUser();

  return (
    <Navbar maxWidth="2xl">
      <NavbarBrand>
        <Link className="flex" href="/">
          <Cog />
          <p className="font-bold text-inherit px-4">APOLLO GEARS</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="/cars" aria-current="page">
            Recipie
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          {/* {user && <Link href={routeMap[user?.role]}>Dashboard</Link>} */}
          <Link href={routeMap.user}>Dashboard</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {user ? (
          <NavbarItem>
            <button
              className=" h-12 px-10 bg-[#6CA12B]"
              color="primary"
              variant="flat"
            >
              Logout
            </button>
          </NavbarItem>
        ) : (
          <NavbarItem className=" h-12 px-10 bg-[#6CA12B]">
            <Link href="/login">Login</Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
