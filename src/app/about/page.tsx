import { UbuntuFont } from "@/fonts";
import Image from "next/image";
import { BookOpen, Users, Trophy, Lightbulb, Calendar, Bell, BarChart3, GraduationCap } from "lucide-react";

export default function About() {
    return (
        <main className="text-primary-baseColor1 min-h-screen">
            <div className="bg-primary-navyBlue glob-px mt-20 w-full flex justify-center items-center h-screen rounded-bl-[4em] md:rounded-bl-[8em] relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[20em] h-[20em] bg-[url('/images/bg-pattern-intro-mobile.svg')] lg:bg-[url('/images/bg-pattern-intro-desktop.svg')] bg-no-repeat bg-contain opacity-20"></div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-primary-navyBlue/90 to-primary-navyBlue/70"></div>
                <div className="absolute inset-0 bg-[url('/images/school-hero.jpg')] bg-cover bg-center opacity-30"></div>
                
                <section className="text-center max-w-4xl relative z-10 px-4">
                <h1 className={`${UbuntuFont.className} font-bold text-4xl md:text-6xl mb-6 leading-tight`}>
                    About Our Department
                </h1>
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                    The Department of Computer Science is dedicated to fostering academic excellence, 
                    innovation, and technological advancement. We provide comprehensive digital solutions 
                    that empower students to achieve their full potential.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="bg-primary-emeraldTeal/20 backdrop-blur-sm border border-primary-emeraldTeal/30 text-primary-baseColor1 px-8 py-4 rounded-lg">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm">Active Students</div>
                    </div>
                    <div className="bg-primary-emeraldTeal/20 backdrop-blur-sm border border-primary-emeraldTeal/30 text-primary-baseColor1 px-8 py-4 rounded-lg">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm">Faculty Members</div>
                    </div>
                    <div className="bg-primary-emeraldTeal/20 backdrop-blur-sm border border-primary-emeraldTeal/30 text-primary-baseColor1 px-8 py-4 rounded-lg">
                    <div className="text-2xl font-bold">10+</div>
                    <div className="text-sm">Years of Excellence</div>
                    </div>
                </div>
                </section>
            </div>

            <section className="glob-px py-16 bg-primary-lightGray">
                <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                    <h2 className={`${UbuntuFont.className} text-3xl md:text-4xl font-bold text-primary-charcoal mb-6`}>
                        Our Mission & Vision
                    </h2>
                    <div className="space-y-6">
                        <div>
                        <h3 className="text-xl font-semibold text-primary-emeraldTeal mb-3">Mission</h3>
                        <p className="text-primary-charcoal leading-relaxed">
                            To provide cutting-edge computer science education and create innovative digital 
                            solutions that streamline academic processes, enhance student experience, and 
                            foster a culture of technological excellence.
                        </p>
                        </div>
                        <div>
                        <h3 className="text-xl font-semibold text-primary-emeraldTeal mb-3">Vision</h3>
                        <p className="text-primary-charcoal leading-relaxed">
                            To be a leading department that bridges the gap between traditional education 
                            and modern technology, creating graduates who are not just technically proficient 
                            but also innovators and problem solvers.
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="relative">
                    <Image 
                        src="/images/pexels-marta-klement.jpg" 
                        alt="Mission and Vision" 
                        width={500} 
                        height={400} 
                        className="rounded-2xl shadow-lg object-cover w-full h-[400px]"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-primary-emeraldTeal text-primary-baseColor1 p-6 rounded-xl shadow-lg">
                        <GraduationCap size={40} />
                    </div>
                    </div>
                </div>
                </div>
            </section>

            <section className="glob-px py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className={`${UbuntuFont.className} text-3xl md:text-4xl font-bold text-primary-charcoal mb-4`}>
                        Our Digital Services
                        </h2>
                        <p className="text-lg text-primary-charcoal max-w-3xl mx-auto">
                        We provide comprehensive digital solutions designed to enhance your academic journey 
                        and keep you connected with everything that matters in your educational experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Cards */}
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                        <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <BarChart3 className="text-primary-emeraldTeal" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Results & Analytics</h3>
                        <p className="text-primary-charcoal/80 leading-relaxed">
                            Access your academic results, track your progress over time, and get detailed 
                            analytics of your performance across different subjects and semesters.
                        </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                        <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Calendar className="text-primary-emeraldTeal" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Smart Timetables</h3>
                        <p className="text-primary-charcoal/80 leading-relaxed">
                            Stay organized with interactive timetables, get automatic updates about schedule 
                            changes, and never miss a class or important academic session.
                        </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                        <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Bell className="text-primary-emeraldTeal" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Live Announcements</h3>
                        <p className="text-primary-charcoal/80 leading-relaxed">
                            Receive real-time notifications about important announcements, deadline reminders, 
                            and critical updates from the department and faculty.
                        </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                        <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Users className="text-primary-emeraldTeal" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Event Management</h3>
                        <p className="text-primary-charcoal/80 leading-relaxed">
                            Discover upcoming events, workshops, seminars, and competitions. Register for 
                            events and track your participation history.
                        </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                            <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="text-primary-emeraldTeal" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Academic Resources</h3>
                            <p className="text-primary-charcoal/80 leading-relaxed">
                                Access course materials, study guides, past papers, and additional learning 
                                resources curated by our faculty members.
                            </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary-emeraldTeal">
                            <div className="bg-primary-emeraldTeal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Lightbulb className="text-primary-emeraldTeal" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-primary-charcoal mb-3">Innovation Hub</h3>
                            <p className="text-primary-charcoal/80 leading-relaxed">
                                Explore research opportunities, connect with innovation projects, and showcase 
                                your own technological solutions and creative work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glob-px py-16 bg-primary-navyBlue">
                <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className={`${UbuntuFont.className} text-3xl md:text-4xl font-bold text-primary-baseColor1 mb-4`}>
                    Our Core Values
                    </h2>
                    <p className="text-lg text-primary-baseColor1/90 max-w-3xl mx-auto">
                    These fundamental principles guide our approach to education, technology, and 
                    student success in everything we do.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="bg-primary-emeraldTeal/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="text-primary-emeraldTeal" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-primary-baseColor1 mb-2">Excellence</h3>
                        <p className="text-primary-baseColor1/80 text-sm">
                            Striving for the highest standards in education, research, and technological innovation.
                        </p>
                        </div>

                        <div className="text-center">
                        <div className="bg-primary-emeraldTeal/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="text-primary-emeraldTeal" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-primary-baseColor1 mb-2">Innovation</h3>
                        <p className="text-primary-baseColor1/80 text-sm">
                            Embracing creativity and cutting-edge technology to solve real-world challenges.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-primary-emeraldTeal/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-primary-emeraldTeal" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-primary-baseColor1 mb-2">Collaboration</h3>
                        <p className="text-primary-baseColor1/80 text-sm">
                            Building strong partnerships between students, faculty, and industry professionals.
                        </p>
                        </div>

                        <div className="text-center">
                        <div className="bg-primary-emeraldTeal/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-primary-emeraldTeal" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-primary-baseColor1 mb-2">Growth</h3>
                        <p className="text-primary-baseColor1/80 text-sm">
                            Fostering continuous learning and personal development for lifelong success.
                        </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glob-px py-16 bg-primary-lightGray">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`${UbuntuFont.className} text-3xl md:text-4xl font-bold text-primary-charcoal mb-6`}>
                        Ready to Experience the Future of Education?
                    </h2>
                    <p className="text-lg text-primary-charcoal mb-8 max-w-3xl mx-auto">
                        Join hundreds of students who are already benefiting from our comprehensive digital 
                        platform. Access all your academic needs in one centralized, user-friendly environment.
                    </p>
                </div>
            </section>
        </main>
    )
}