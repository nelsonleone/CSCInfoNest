"use client"

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

// Zod Schema for the complaint form
const complaintSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .regex(/^[A-Z0-9]{6,12}$/, "Student ID must be 6-12 alphanumeric characters"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Please select a complaint category"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(150, "Subject must be less than 150 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Please select a priority level",
  }),
})

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function SupportPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<ComplaintFormData> = async (data) => {
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      const res = await fetch("/api/send_contact_mail", {
        method: "POST",
        body: JSON.stringify({ name: data.fullName, email: data.email, message: data.description, subject: data.subject, studentId: data.studentId, phoneNumber: data.phoneNumber, category: data.category, priority: data.priority }),
      })
      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData.message)
      }
      toast.success("Form submitted successfully!")
      setSubmitSuccess(true)
      reset()
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
      toast.error("An unexpected error occurred")
    }
  };

  const clearMessages = () => {
    setSubmitError("")
    setSubmitSuccess(false)
  };

  const complaintCategories = [
    { value: "results", label: "Results & Grades" },
    { value: "timetable", label: "Timetable Issues" },
    { value: "announcements", label: "Missing Announcements" },
    { value: "events", label: "Event Registration" },
    { value: "technical", label: "Technical Issues" },
    { value: "academic", label: "Academic Concerns" },
    { value: "administrative", label: "Administrative Issues" },
    { value: "other", label: "Other" },
  ]

  const faqData = [
    {
      question: "How do I access my semester results?",
      answer:
        "Results are posted in the 'Results' section once they're officially released by the department. You'll receive a notification via email and the announcement board when your results are available. Simply log in and navigate to the Results tab to view your grades.",
    },
    {
      question: "Where can I find the current class timetable?",
      answer:
        "The most up-to-date timetables are available in the 'Timetables' section. We update schedules regularly to reflect any changes in class timings, venue modifications, or lecturer substitutions. Make sure to check regularly for updates.",
    },
    {
      question: "How will I be notified about important announcements?",
      answer:
        "All department announcements are posted in the 'Announcements' section and sent via email to your registered student email address. This includes exam schedules, deadline changes, academic calendar updates, and important departmental notices.",
    },
    {
      question: "Can I register for department events through this portal?",
      answer:
        "Yes! All department events including seminars, workshops, career fairs, and social events can be found in the 'Events' section. You can view event details, register for participation, and receive updates about upcoming activities.",
    },
    {
      question: "What should I do if I can't find my results or if there's an error?",
      answer:
        "If your results aren't showing or you notice any discrepancies, first check if results have been officially released. If the issue persists, contact the department office immediately or use the complaint form below to submit a detailed query.",
    },
    {
      question: "How often is the information on this portal updated?",
      answer:
        "The portal is updated in real-time. Results are posted as soon as they're approved, timetables are updated immediately when changes occur, and announcements are posted as they happen. We recommend checking the portal regularly or enabling notifications.",
    },
  ]

  return (
    <div className="pt-24 bg-primary-navyBlue">
      {/* Header */}
      <div className="text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto">
            Get help with your student portal, submit complaints, and find answers
            to frequently asked questions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary-emeraldTeal/10 text-primary-emeraldTeal font-medium rounded-full text-sm uppercase tracking-wide mb-4">
                Help & Support
              </span>
              <h2 className="text-2xl font-bold text-primary-navyBlue mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-primary-charcoal/70">
                Find quick answers to common questions about the student portal
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 font-semibold text-primary-navyBlue hover:text-primary-emeraldTeal">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-primary-charcoal leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Complaint Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-700 font-medium rounded-full text-sm uppercase tracking-wide mb-4">
                Submit Complaint
              </span>
              <h2 className="text-2xl font-bold text-primary-navyBlue mb-4">
                File a Complaint
              </h2>
              <p className="text-primary-charcoal/70">
                Having issues? Submit a detailed complaint and our support team
                will get back to you within 24 hours
              </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">
                    Complaint submitted successfully!
                  </p>
                  <p className="text-green-700 text-sm">
                    You'll receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">
                    Error submitting complaint
                  </p>
                  <p className="text-red-700 text-sm">{submitError}</p>
                  <button
                    onClick={clearMessages}
                    className="text-red-600 text-sm underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Student Reg No. *
                </label>
                <input
                  {...register("studentId")}
                  type="text"
                  placeholder="e.g., CS2021001"
                  className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                    errors.studentId ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  onChange={() => clearErrors("studentId")}
                />
                {errors.studentId && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                  Full Name *
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                    errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  onChange={() => clearErrors("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email & Phone Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your.email@student.edu"
                    className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    onChange={() => clearErrors("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                      errors.phoneNumber ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    onChange={() => clearErrors("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category & Priority Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                      errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    onChange={() => clearErrors("category")}
                  >
                    <option value="">Select category</option>
                    {complaintCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                    Priority Level *
                  </label>
                  <select
                    {...register("priority")}
                    className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                      errors.priority ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    onChange={() => clearErrors("priority")}
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.priority.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                  Subject *
                </label>
                <textarea
                  {...register("subject")}
                  placeholder="Brief description of your issue"
                  className={`w-full h-40 px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all ${
                    errors.subject ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  onChange={() => clearErrors("subject")}
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-primary-navyBlue mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Detailed Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Please provide a detailed description of your complaint including any relevant dates, times, and circumstances..."
                  className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-emeraldTeal focus:border-transparent transition-all resize-none ${
                    errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  onChange={() => clearErrors("description")}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full bg-primary-emeraldTeal hover:bg-primary-emeraldTeal/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 mb-16 bg-primary-navyBlue rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold mb-2">Emergency Support</h4>
              <p className="text-white/80">Call: +2349134142693</p>
              <p className="text-white/60 text-sm">Available 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Department Office</h4>
              <p className="text-white/80">Email: support@department.edu</p>
              <p className="text-white/60 text-sm">Mon-Fri, 9AM-5PM</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Walk-in Support</h4>
              <p className="text-white/80">Room 201, Department Building</p>
              <p className="text-white/60 text-sm">Mon-Fri, 10AM-4PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}