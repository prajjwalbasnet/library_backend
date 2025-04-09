import { sendEmail } from "./sendEmail.js";
import { getVerificationEmailTemplate } from "./emailTemplates.js";

export const sendVerification = async (email, verificationCode, name) => {
  const subject = "CIHE-Library - Verify Your Email";
  const htmlContent = getVerificationEmailTemplate(name, verificationCode);
  return await sendEmail(email, subject, htmlContent);
};
