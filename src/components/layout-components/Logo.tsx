import Image, { StaticImageData } from "next/image"
import Link from "next/link"

interface IProps {
    src: StaticImageData,
    width?: number,
    height?: number,
    className?: string
}

export default function Logo({ width, height, className, src }: IProps){
    return (
        <Link href="/" className="inline-block">
            <Image src={src} alt="Logo" width={width} height={height} className={className} />
        </Link>
    )
}