"use client"

import ExamPeriodHighlight from "@/components/homepage/ExamPeriodHighlight";
import FeaturedEvent from "@/components/homepage/FeaturedEvent";
import { UbuntuFont } from "@/fonts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  return (
    <main className="text-primary-baseColor1 min-h-screen">
      <div className="bg-primary-navyBlue glob-px mt-20 w-full flex justify-center items-center h-screen rounded-bl-[4em] md:rounded-bl-[8em] relative">
        {/* Background SVG */}
        <div className="absolute bottom-0 left-0 w-[20em] h-[20em] bg-[url('/images/bg-pattern-intro-mobile.svg')] lg:bg-[url('/images/bg-pattern-intro-desktop.svg')] bg-no-repeat bg-contain opacity-20"></div>
        
        <section className="text-center max-w-md relative z-10">
          <h1 className={`${UbuntuFont.className} font-bold text-3xl md:text-4xl mb-4`}>All Student Information In One Place</h1>
          <p className="mb-8">Access your results, check upcoming timetables, stay updated with the latest announcements, and never miss an event</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => router.push("/events")} className="bg-primary-emeraldTeal hover:bg-primary-emeraldTeal/80 text-primary-baseColor1 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex-1 min-w-[200px] max-w-[280px]">
              Ongoing Events
            </button>
            <button onClick={() => router.push("/announcements")} className="bg-transparent border-2 border-primary-emeraldTeal text-primary-emeraldTeal hover:bg-emerald-600 hover:text-primary-baseColor1 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex-1 min-w-[200px] max-w-[280px]">
              Announcements
            </button>
          </div>
        </section>
      </div>

      <section className="glob-px flex flex-col gap-7 text-black mt-16 py-8 md:flex-row">
        <Image src="/images/hero-image1.jpg" alt="Hero Image" width={500} height={500} className="object-contain" />
        <div>
          <h2 className="text-3xl font-semibold mb-3 md:mb-8">Empowering Students, Driving Innovation.</h2>
          <p>
            At the Department of Computer Science, we are committed to making academic life easier and more meaningful for every student. Beyond just classes and results, we provide tools, information, and support that keep you connected to what truly matters. Our goal is to create an environment where knowledge meets creativity, and where innovation is nurtured to solve real-world problems. We believe in equipping students with the skills and mindset to thrive not just in academics, but in the ever-evolving world of technology.
          </p>
        </div>
      </section>

      <FeaturedEvent />

      <ExamPeriodHighlight />
    </main>
  )
}