"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClickAwayListener } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type NavLink = {
    link: string;
    text: string;
}

type MobileNavProps = {
    isOpen: boolean;
    onClose: () => void;
    navLinks: NavLink[];
    className?: string;
};

function MobileNav({ 
    isOpen, 
    onClose, 
    navLinks,
    className = "" 
}: MobileNavProps) {
    const pathName = usePathname();

    const slideVariants = {
        closed: {
        x: "-100%",
            transition: {
                type: "tween",
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
        x: "0%",
            transition: {
                type: "tween",
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const overlayVariants = {
        closed: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
        },
        open: {
        opacity: 1,
        transition: {
            duration: 0.2
        }
        }
    };

    const linkVariants = {
        closed: {
        x: 20,
        opacity: 0
        },
        open: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
            ease: "easeOut"
        }
        })
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            {/* Overlay */}
            <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={overlayVariants}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={onClose}
            />

            <ClickAwayListener onClickAway={onClose}>
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={slideVariants}
                    className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-primary-navyBlue shadow-2xl z-50 lg:hidden ${className}`}
                >
                <div className="flex items-center justify-between p-6 border-b border-primary-lightGray/20">
                    <h2 className="text-xl font-semibold text-primary-baseColor1">
                        Menu
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-primary-baseColor1/10 transition-colors duration-200"
                        aria-label="Close menu"
                        >
                        <X className="w-6 h-6 text-primary-baseColor1" />
                    </button>
                </div>

                <nav className="flex flex-col p-6 space-y-2">
                    {navLinks.map((link, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        initial="closed"
                        animate="open"
                        variants={linkVariants}
                    >
                        <Link
                        href={link.link}
                        onClick={onClose}
                        className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-baseColor1/10 hover:translate-x-2 ${
                            pathName === link.link 
                            ? "text-primary-emeraldTeal bg-primary-emeraldTeal/10 border-l-4 border-primary-emeraldTeal" 
                            : "text-primary-baseColor1 hover:text-primary-emeraldTeal"
                        }`}
                        >
                        {link.text}
                        </Link>
                    </motion.div>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-primary-emeraldTeal/10 rounded-lg border border-primary-emeraldTeal/20">
                    <p className="text-sm text-primary-baseColor1/80 text-center">
                        Welcome to your department portal
                    </p>
                    </div>
                </div>
                </motion.div>
            </ClickAwayListener>
            </>
        )}
        </AnimatePresence>
    )
}

export default MobileNav;