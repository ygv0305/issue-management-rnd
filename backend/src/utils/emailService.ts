/**
 * @fileoverview Email service utility.
 * Provides functions to initialize a nodemailer transporter using Ethereal Email
 * (for development) and send HTML emails. Used for registration verification,
 * password reset, and other notification emails.
 * @module utils/emailService
 */

// Node modules
import nodemailer from 'nodemailer';

/** Nodemailer transporter instance (lazily initialized) */
let transporter: nodemailer.Transporter;

/**
 * Initializes and caches the nodemailer transporter using Ethereal Email.
 * Ethereal is a fake SMTP service that captures messages for preview.
 * @async
 * @returns {Promise<nodemailer.Transporter>} Configured nodemailer transporter
 */
export const initEmailTransporter = async () => {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log('Ethereal Email connected. Account: ', testAccount.user);
  }
  return transporter;
};

/**
 * Sends an HTML email to the specified recipient.
 * @async
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email body content
 * @returns {Promise<nodemailer.SentMessageInfo>} Email send result info
 * @throws {Error} If email sending fails
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailTransporter = await initEmailTransporter();
    const info = await mailTransporter.sendMail({
      from: '"AUT R&D Issue Management" <noreply@aut.ac.nz>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // URL to view email
    return info;
  } catch (error) {
    console.error('Error sending email, ', error);
    throw new Error('Failed to send email', { cause: error });
  }
};
