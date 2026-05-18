/**
 * @fileoverview Email service utility.
 * Provides functions to initialize a nodemailer transporter using Ethereal Email
 * (for development) and send HTML emails. Used for registration verification,
 * password reset, and other notification emails.
 * @module utils/emailService
 */

// Node modules
import nodemailer from 'nodemailer';

// Config
import config from '../config/env.js';

// Nodemailer transporter instance (lazily initialized)
let transporter: nodemailer.Transporter;

const createConfiguredTransporter = (): nodemailer.Transporter => {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

/**
 * Initializes and caches the nodemailer transporter.
 * Uses configured SMTP in production and falls back to Ethereal for local development.
 * @async
 * @returns {Promise<nodemailer.Transporter>} Configured nodemailer transporter
 */
export const initEmailTransporter =
  async (): Promise<nodemailer.Transporter> => {
    if (!transporter) {
      const hasConfiguredSmtp =
        Boolean(config.SMTP_HOST) &&
        Boolean(config.SMTP_PORT) &&
        Boolean(config.SMTP_USER) &&
        Boolean(config.SMTP_PASS);

      if (hasConfiguredSmtp) {
        transporter = createConfiguredTransporter();
        console.log('SMTP transporter configured for host: ', config.SMTP_HOST);
      } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // True for 465, false for other ports
          auth: {
            user: testAccount.user, // Generated Ethereal user
            pass: testAccount.pass, // Generated Ethereal password
          },
        });
        console.log('Ethereal Email connected. Account: ', testAccount.user);
      }
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
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const mailTransporter = await initEmailTransporter();
    const info = await mailTransporter.sendMail({
      from: config.SMTP_FROM, // Sender address
      to, // List of receivers
      subject, // Subject line
      html, // Html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // URL to view email
    return info;
  } catch (error) {
    console.error('Error sending email, ', error);
    throw new Error('Failed to send email', { cause: error });
  }
};
