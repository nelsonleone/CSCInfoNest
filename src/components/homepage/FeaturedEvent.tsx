import { UbuntuFont } from "@/fonts";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export default function FeaturedEvent() {
    return (
        <section className="bg-gradient-to-br from-primary-lightGray to-white py-16 lg:py-24">
            <div className="glob-px max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 bg-primary-emeraldTeal/10 text-primary-emeraldTeal font-medium rounded-full text-sm uppercase tracking-wide mb-4">
                        Featured Event
                    </span>
                    <h2 className={`${UbuntuFont.className} text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-navyBlue mb-4`}>
                        Annual Science Innovation Fair 2024
                    </h2>
                    <p className="text-primary-charcoal/70 max-w-2xl mx-auto text-lg">
                        Join us for our biggest academic showcase of the year featuring groundbreaking student research, innovations, and scientific discoveries
                    </p>
                </div>

                {/* Main Event Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-full min-h-[400px] bg-gradient-to-br from-teal-500 to-blue-900 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/50"></div>
                        <Image 
                            src="/images/pexels-anntarazevich.jpg" 
                            alt="woman in a lab coat" 
                            width={600} 
                            height={400} 
                            className="object-cover w-full h-full" 
                        />
                        
                        {/* Main content - centered */}
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                            <div className="text-center text-white max-w-md mx-auto">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                            </div>
                            
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-lg leading-tight">
                                Science Innovation Fair
                            </h1>
                            
                            <p className="text-sm sm:text-base text-white/90 font-light drop-shadow-md">
                                Discover the Future of Science
                            </p>
                            </div>
                        </div>
                        
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                            <span className="text-blue-900 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <span className="text-base">🏆</span>
                                Annual Event
                            </span>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                            <div className="bg-teal-500/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                            <span className="text-white font-medium text-xs sm:text-sm">
                                2025
                            </span>
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-1/4 left-8 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-12 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-1000"></div>
                    </div>

                    {/* Event Details */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                            {/* Event Meta Info */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 text-primary-charcoal">
                                    <div className="w-10 h-10 bg-primary-emeraldTeal/10 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary-emeraldTeal" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-charcoal/60">Date</p>
                                        <p className="font-semibold">October 15-17, 2025</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 text-primary-charcoal">
                                    <div className="w-10 h-10 bg-primary-emeraldTeal/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary-emeraldTeal" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-charcoal/60">Time</p>
                                        <p className="font-semibold">9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 text-primary-charcoal sm:col-span-2">
                                    <div className="w-10 h-10 bg-primary-emeraldTeal/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary-emeraldTeal" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-charcoal/60">Location</p>
                                        <p className="font-semibold">Main Campus Auditorium & Science Labs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Description */}
                            <div>
                            <h3 className="text-xl font-bold text-primary-navyBlue mb-3">What to Expect</h3>
                            <ul className="space-y-2 text-primary-charcoal/80">
                                <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary-emeraldTeal rounded-full mt-2"></div>
                                <span>150+ student research presentations across all science disciplines</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary-emeraldTeal rounded-full mt-2"></div>
                                <span>Interactive workshops and hands-on demonstrations</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary-emeraldTeal rounded-full mt-2"></div>
                                <span>Keynote speakers from leading research institutions</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary-emeraldTeal rounded-full mt-2"></div>
                                <span>Awards ceremony and scholarship opportunities</span>
                                </li>
                            </ul>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="bg-transparent border-2 border-primary-navyBlue text-primary-navyBlue hover:bg-primary-navyBlue hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-primary-navyBlue rounded-2xl p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between text-white">
                        <div className="text-center lg:text-left mb-4 lg:mb-0">
                        <h4 className="text-lg font-semibold mb-2">Don't miss out on this incredible opportunity!</h4>
                        <p className="text-primary-baseColor1/80">Limited spots available. Early registration ends August 1st.</p>
                        </div>
                        <div className="flex items-center space-x-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-emeraldTeal">500+</div>
                            <div className="text-sm text-primary-baseColor1/70">Expected Attendees</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-emeraldTeal">$50K</div>
                            <div className="text-sm text-primary-baseColor1/70">Prize Pool</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-emeraldTeal">3</div>
                            <div className="text-sm text-primary-baseColor1/70">Days</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}