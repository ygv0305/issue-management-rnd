// Node modules
import nodemailer from 'nodemailer';

// Since this is for dev testing we will use Ethereal Email.
// It creates a test account automatically.
let transporter: nodemailer.Transporter;

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
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
