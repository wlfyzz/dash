'use server'

import { Resend } from 'resend'

const resend = new Resend(`re_T6gMzW2B_A5GC3955pg7C38mGsqQTwVBz`)

export async function sendEmail(email: string, subject: string, content: string) {
  try {
    await resend.emails.send({
      from: 'mail@demo.thatdevwolfy.lol',
      to: email,
      subject: subject,
      html: content
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to send email' }
  }
}
