"use client"

import LogoSrc from "../../public-assets/logo/logo.png";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {

   const pathName = usePathname()

   return (
      !pathName.match("/auth") &&
      <footer className={`relative overflow-hidden bg-gradient-to-br from-primary-navyBlue via-primary-navyBlue to-primary-charcoal`}>
         <div className="absolute inset-0 bg-[url('/images/bg-pattern-intro-mobile.svg')] bg-no-repeat bg-right-top opacity-5"></div>
         
         <div className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
                  
                  {/* Logo & Description Column */}
                  <div className="lg:col-span-2">
                     <Logo src={LogoSrc} width={60} height={60} />
                     <h3 className="text-xl font-bold text-primary-baseColor1 mb-4">
                        Student Information Portal
                     </h3>
                     <p className="text-primary-baseColor1/80 leading-relaxed mb-6 max-w-md">
                        Your comprehensive platform for accessing academic results, timetables, 
                        announcements, and department events. Streamlining student information 
                        for academic excellence.
                     </p>
                     
                     {/* Social Links */}
                     <div className="flex space-x-4">
                        <Link 
                           href="/" 
                           className="w-10 h-10 bg-primary-baseColor1/10 hover:bg-primary-emeraldTeal transition-all duration-300 rounded-full flex items-center justify-center group"
                        >
                           <Facebook className="w-5 h-5 text-primary-baseColor1 group-hover:text-white" />
                        </Link>
                        <Link 
                           href="/" 
                           className="w-10 h-10 bg-primary-baseColor1/10 hover:bg-primary-emeraldTeal transition-all duration-300 rounded-full flex items-center justify-center group"
                        >
                           <Twitter className="w-5 h-5 text-primary-baseColor1 group-hover:text-white" />
                        </Link>
                        <Link 
                           href="/" 
                           className="w-10 h-10 bg-primary-baseColor1/10 hover:bg-primary-emeraldTeal transition-all duration-300 rounded-full flex items-center justify-center group"
                        >
                           <Instagram className="w-5 h-5 text-primary-baseColor1 group-hover:text-white" />
                        </Link>
                        <Link 
                           href="/" 
                           className="w-10 h-10 bg-primary-baseColor1/10 hover:bg-primary-emeraldTeal transition-all duration-300 rounded-full flex items-center justify-center group"
                        >
                           <Linkedin className="w-5 h-5 text-primary-baseColor1 group-hover:text-white" />
                        </Link>
                     </div>
                  </div>

                  {/* Quick Links Column */}
                  <div>
                  <h4 className="text-lg font-semibold text-primary-baseColor1 mb-6">Quick Links</h4>
                  <ul className="space-y-3">
                     <li>
                        <Link 
                        href="/" 
                        className="text-primary-baseColor1/80 hover:text-primary-emeraldTeal transition-colors duration-200 flex items-center group"
                        >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Student Results</span>
                        </Link>
                     </li>
                     <li>
                        <Link 
                        href="/" 
                        className="text-primary-baseColor1/80 hover:text-primary-emeraldTeal transition-colors duration-200 flex items-center group"
                        >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Timetables</span>
                        </Link>
                     </li>
                     <li>
                        <Link 
                        href="/" 
                        className="text-primary-baseColor1/80 hover:text-primary-emeraldTeal transition-colors duration-200 flex items-center group"
                        >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Announcements</span>
                        </Link>
                     </li>
                     <li>
                        <Link 
                        href="/" 
                        className="text-primary-baseColor1/80 hover:text-primary-emeraldTeal transition-colors duration-200 flex items-center group"
                        >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Events</span>
                        </Link>
                     </li>
                     <li>
                        <Link 
                        href="/" 
                        className="text-primary-baseColor1/80 hover:text-primary-emeraldTeal transition-colors duration-200 flex items-center group"
                        >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Support Center</span>
                        </Link>
                     </li>
                  </ul>
                  </div>

                  {/* Contact Information Column */}
                  <div>
                  <h4 className="text-lg font-semibold text-primary-baseColor1 mb-6">Contact Information</h4>
                  <div className="space-y-4">
                     <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-emeraldTeal/20 rounded-full flex items-center justify-center mt-1">
                        <MapPin className="w-4 h-4 text-primary-emeraldTeal" />
                        </div>
                        <div>
                        <p className="text-primary-baseColor1/80 text-sm leading-relaxed">
                           Department of Computer Science<br />
                           FUTO<br />
                        </p>
                        </div>
                     </div>
                     
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-emeraldTeal/20 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary-emeraldTeal" />
                        </div>
                        <p className="text-primary-baseColor1/80">+2349134142693</p>
                     </div>
                     
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-emeraldTeal/20 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary-emeraldTeal" />
                        </div>
                        <p className="text-primary-baseColor1/80">onelsonuchechukwu@gmail.com</p>
                     </div>
                     
                     <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-emeraldTeal/20 rounded-full flex items-center justify-center mt-1">
                        <Clock className="w-4 h-4 text-primary-emeraldTeal" />
                        </div>
                        <div>
                        <p className="text-primary-baseColor1/80 text-sm">
                           Office Hours:<br />
                           Monday - Friday: 8:00 AM - 5:00 PM<br />
                        </p>
                        </div>
                     </div>
                  </div>
                  </div>
               </div>

               {/* Divider */}
               <div className="border-t border-primary-baseColor1/20 mt-12 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  
                  {/* Copyright */}
                  <div className="text-center md:text-left">
                     <p className="text-primary-baseColor1/70 text-sm">
                        © 2024 Department Student Portal. All rights reserved.
                     </p>
                     <p className="text-primary-baseColor1/60 text-xs mt-1">
                        Designed with ❤️ for academic excellence
                     </p>
                  </div>

                  {/* Footer Links */}
                  <div className="flex space-x-6">
                     <Link 
                        href="/" 
                        className="text-primary-baseColor1/70 hover:text-primary-emeraldTeal text-sm transition-colors duration-200"
                     >
                        Privacy Policy
                     </Link>
                     <Link 
                        href="/" 
                        className="text-primary-baseColor1/70 hover:text-primary-emeraldTeal text-sm transition-colors duration-200"
                     >
                        Terms of Service
                     </Link>
                     <Link 
                        href="/" 
                        className="text-primary-baseColor1/70 hover:text-primary-emeraldTeal text-sm transition-colors duration-200"
                     >
                        Accessibility
                     </Link>
                  </div>
                  </div>
               </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-emeraldTeal/10 rounded-full -translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-primary-emeraldTeal/5 rounded-full translate-x-12 -translate-y-12"></div>
         </div>
      </footer>
   )
}