"use client"

import { useState, useEffect } from 'react';
import { Calendar, Backpack } from 'lucide-react';
import Image from 'next/image';

export default function ResumptionPeriodHighlight() {

    const [daysLeft, setDaysLeft] = useState(21)

    useEffect(() => {
        const resumptionDate = new Date('2025-11-01')
        
        const calculateDaysLeft = () => {
            const currentDate = new Date()
            const timeDiff = resumptionDate.getTime() - currentDate.getTime()
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24))
            return Math.max(0, days)
        }

        // Update countdown daily
        const updateCountdown = () => {
            setDaysLeft(calculateDaysLeft())
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 86400000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="bg-gray-50 py-12">
            <div className="glob-px">
                <div className='md:flex gap-10'>
                    <Image src="/images/pexels-rdne.jpg" alt='students on campus' width={500} height={300} className="h-80 w-full md:h-[35em] md:w-[35em] object-cover rounded-lg" />
                    <div className="flex flex-row mt-4 md:mt-0 flex-wrap gap-8">
                        
                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resumption Date</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">{daysLeft}</div>
                            <p className="text-sm text-gray-600">Days Remaining</p>
                        </div>

                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Backpack className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumption Preparation</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>Confirm your registration status and course enrollment</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>Check your class schedule and timetable</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>Prepare accommodation and travel arrangements</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>Review last semester's materials and notes</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>Get your textbooks and learning materials ready</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}