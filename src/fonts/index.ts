import { Overpass, Ubuntu } from "next/font/google";

export const OverPassFont = Overpass({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

export const UbuntuFont = Ubuntu({
    subsets: ["latin"],
    weight: ["400", "500", "700"]
})