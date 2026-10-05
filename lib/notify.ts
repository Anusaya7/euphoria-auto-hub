import nodemailer from 'nodemailer';

type EnquiryNotice = {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  message: string;
};

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM && process.env.ENQUIRY_NOTIFY_TO);
}

export async function notifyNewEnquiry(enquiry: EnquiryNotice) {
  if (!mailConfigured()) return { sent: false as const };

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ENQUIRY_NOTIFY_TO,
    replyTo: enquiry.email,
    subject: `New enquiry from ${enquiry.first_name} ${enquiry.last_name}`.trim(),
    text: [
      `Name: ${enquiry.first_name} ${enquiry.last_name}`.trim(),
      `Email: ${enquiry.email}`,
      `Mobile: ${enquiry.mobile}`,
      '',
      enquiry.message,
    ].join('\n'),
  });

  return { sent: true as const };
}
