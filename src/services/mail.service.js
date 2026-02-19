import nodemailer from "nodemailer";

export const sendResetMail = async (to, link) => {
  // Crear cuenta de prueba automática
  const testAccount = await nodemailer.createTestAccount();

  // Crear transporter usando esa cuenta
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Enviar mail
  const info = await transporter.sendMail({
    from: '"Ecommerce Backend" <no-reply@ecommerce.test>',
    to,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña.</p>
      <a href="${link}" 
         style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
         Restablecer contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  });

  console.log("📩 Mail de prueba enviado con Ethereal");
  console.log("🔎 Preview URL:");
  console.log(nodemailer.getTestMessageUrl(info));
};

