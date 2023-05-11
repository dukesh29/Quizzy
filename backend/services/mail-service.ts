import nodemailer from 'nodemailer';

export const sendActivationMail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Активация аккаунта на ' + process.env.API_URL,
    html: `<h3>Добро пожаловать в Quizzy!!!</h3>
       Нажми на ссылку <a href="${link}">${link} сюда</a> чтобы активировать свой аккаунт!`,
  };

  await transporter.sendMail(mailOptions);
};
