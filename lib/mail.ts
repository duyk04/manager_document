import nodemailer from "nodemailer";

const email = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

export const sendMail = async (
    subject: string,
    userEmail: string,
    text: string,
) => {
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email, // Email gửi
                pass: password, // Mật khẩu ứng dụng (App Password)
            },
        });

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error(error);
    }
}