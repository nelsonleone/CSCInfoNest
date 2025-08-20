"use client";

import Logo from "./Logo";
import LogoSrc from "../../public-assets/logo/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  closeMobileNav,
  toggleMobileNav,
} from "@/lib/redux/slices/mobileNavSlice";
import { useEffect } from "react";
import UseWindowSize from "../custom-utils/UseWindowSize";
import { navLinks } from "@/components-data/navLinks";
import Hamburger from "hamburger-react";
import MobileNav from "./MobileNav";

export default function Header() {
  const { width } = UseWindowSize()
  const { isOpen } = useAppSelector((store) => store.mobileNav)
  const dispatch = useAppDispatch()
  const pathName = usePathname()

  useEffect(() => {
    if (width >= 1024 && isOpen) {
      dispatch(closeMobileNav())
    }
  }, [width, isOpen])

  const handleToggleMobileNav = () => {
    dispatch(toggleMobileNav())
  };

  useEffect(() => {
    if (width >= 1024 && isOpen) {
      dispatch(closeMobileNav())
    }
  }, [pathName])


  return (
    !pathName.match("/auth") &&
    <header>
      <div className="h-24 bg-primary-navyBlue flex text-primary-baseColor1 justify-center items-center absolute w-full top-0 left-0 z-40">
        <div className="glob-px flex items-center justify-between w-full">
          <Logo src={LogoSrc} width={80} height={60} />

        <nav className="hidden lg:flex space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={`inline-block ${
                pathName === link.link
                  ? "text-primary-emeraldTeal border-b-2 border-primary-emeraldTeal"
                  : "border-b-2 border-b-transparent hover:text-primary-emeraldTeal hover:border-b-2 hover:border-primary-emeraldTeal"
              } font-medium transition-colors duration-200`}
              >
                {link.text}
              </Link>
          ))}
        </nav>

          <div className="lg:hidden">
            <Hamburger toggle={handleToggleMobileNav} />
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={isOpen}
        onClose={handleToggleMobileNav}
        navLinks={navLinks}
      />

      <div className="absolute top-24 left-0 right-0 z-40">
        <div className="glob-px">
          <div className="h-px bg-gray-300"></div>
        </div>
      </div>
    </header>
  )
}