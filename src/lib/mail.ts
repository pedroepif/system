import nodemailer from "nodemailer";
import { env } from "@/env";

const transporter = nodemailer.createTransport(env.EMAIL_SERVER);

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    throw error;
  }
};
