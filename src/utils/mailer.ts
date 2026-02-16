import nodemailer from "nodemailer";
// import { getWelcomeEmailTemplate } from "./mailTemplate";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "qahveenreading@gmail.com",
    pass: "wxld imsf vvny gaaf",
  },
});

export const sendMail = async (options: {
  to: string;
  subject: string;
  text: string;
  html?: any;
}) => {
  try {
    const request = await transporter.sendMail({
      from: "qahveenreading6@gmail.com", // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      ...(options?.html && {
        html: options.html,
      }),
    });


    return request;
  } catch (err) {
  }
};
