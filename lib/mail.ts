import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendMail = async (
    subject: string,
    email: string,
    content: string

) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset password",
            html: `Password: ${content}`
        })
    } catch (error) {
        console.error(error)
    }
}