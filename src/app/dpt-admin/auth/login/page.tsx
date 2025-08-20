"use client"

import { GraduationCap, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import { LoginAccountFormData, loginSchema } from '@/schema/login.schema';
import PasswordInput from '@/components/custom-utils/PasswordInput';
import { UbuntuFont } from '@/fonts';
import { login } from '@/actions/auth.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';



export default function CSCLoginPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginAccountFormData>({
        resolver: zodResolver(loginSchema),
    })

    const router = useRouter()

    const onSubmit : SubmitHandler<LoginAccountFormData> = async(data) => {
       const { error, success } = await login(data)

       if (error && !success) {
            toast.error(error.message || "Login failed. Please try again.")
        }
        else{
            toast.success("Login successful! Redirecting...")
            router.push('/dpt-admin')
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 md:flex">
            <div className="md:w-1/2 h-[20em] md:min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800 to-indigo-900/90"></div>
                <div className="relative z-10 px-8 lg:px-16 flex flex-col justify-center min-h-screen">
                    <Image src="/images/pexels-thisisengineering.jpg" alt='Hero Image' width={500} height={500} className="absolute top-0 left-0 w-full h-full object-cover opacity-20" />
                    <div className="text-center relative flex items-center flex-col justify-center z-10 lg:text-left mb-12">
                        <div className="flex items-center justify-center lg:justify-start mb-6">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mr-4">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">CSCInfoNest</h1>
                                <p className="text-blue-200 text-sm">Computer Science Department</p>
                            </div>
                        </div>
                        <p className="text-xl lg:text-2xl font-semibold text-white mb-4 leading-tight">
                            Access Your Academic Hub
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/2 flex items-center justify-center p-8 md:px-16 md:pt-24">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-2 ${UbuntuFont.className}`}>
                            Admin Login
                        </h2>
                        <p className="text-gray-600">
                            Enter your credentials to access the portal
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`border border-gray-200 rounded-md p-4 text-sm block w-full outline-none focus:ring-2
                                    transition-all duration-200 pr-12`}
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <PasswordInput register={register} name='password' />
                            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="bg-primary-emeraldTeal text-primary-baseColor1 font-medium text-sm rounded-md mt-4 block min-w-32 p-3 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                            >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                <span>Login</span>
                            )}
                            </button>                    </form>
                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>© 2025 CSCInfoNest - Computer Science Department</p>
                    </div>
                </div>
            </div>
        </main>
    )
}