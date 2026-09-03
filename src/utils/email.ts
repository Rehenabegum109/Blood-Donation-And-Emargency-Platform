import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import config from "../config";


export const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: Number(config.smtp_port),
  secure: Number(config.smtp_port) === 465,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
});

// Email verification OTP
export const sendEmailVerificationEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "verification_email.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    name,
    otp,
  });

  await transporter.sendMail({
    from: `"BloodLink" <${config.email_sender}>`,
    to: email,
    subject: "Verify Your BloodLink Account",
    html,
  });
};

// Forgot password OTP
export const sendForgotPasswordEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "forgot_password.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    name,
    otp,
  });

  await transporter.sendMail({
    from: `"BloodLink" <${config.email_sender}>`,
    to: email,
    subject: "BloodLink Password Reset OTP",
    html,
  });
};

// Password reset success
export const sendResetPasswordEmail = async (
  email: string,
  name: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "reset_password.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    name,
  });

  await transporter.sendMail({
    from: `"BloodLink" <${config.email_sender}>`,
    to: email,
    subject: "BloodLink Password Reset Successful",
    html,
  });
};

// Welcome email
export const sendWelcomeEmail = async (
  email: string,
  name: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "welcome_email.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    name,
  });

  await transporter.sendMail({
    from: `"BloodLink" <${config.email_sender}>`,
    to: email,
    subject: "Welcome to BloodLink 🎉",
    html,
  });
};