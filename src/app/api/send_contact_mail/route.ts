import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { name, email, message, studentId, priority, category, phoneNumber, subject } = data;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_EMAIL_USER,
        pass: process.env.NEXT_EMAIL_PASS,
      },
    })

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.NEXT_COMPANY_EMAIL,
      subject: `CSCInfoNest Contact Form: ${subject || 'No Subject'}`,
      html: `
      <h2>Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone Number:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${phoneNumber || 'N/A'}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Student ID:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${studentId || 'N/A'}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Priority:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${priority || 'N/A'}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Category:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${category || 'N/A'}</td>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${subject || 'N/A'}</td>
        </tr>
      </table>
      <h3>Message:</h3>
      <p style="white-space: pre-line;">${message}</p>
      `,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 })
  }
}
