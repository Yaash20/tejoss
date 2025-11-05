const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  orderConfirmation: (orderNumber, userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pesanan Berhasil Dibuat!</h1>
        </div>
        <div class="content">
          <p>Halo ${userName},</p>
          <p>Terima kasih telah memesan layanan di Tejoss. Pesanan Anda telah berhasil dibuat.</p>
          <p><strong>Nomor Pesanan:</strong> ${orderNumber}</p>
          <p>Silakan lakukan pembayaran untuk melanjutkan proses pesanan Anda.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/my-orders" class="button">Lihat Pesanan</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 Tejoss. Platform Jasa Pertanian Terpercaya.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  paymentConfirmation: (orderNumber, userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pembayaran Berhasil!</h1>
        </div>
        <div class="content">
          <p>Halo ${userName},</p>
          <div class="success">
            <p><strong>✓ Pembayaran Anda telah dikonfirmasi</strong></p>
          </div>
          <p><strong>Nomor Pesanan:</strong> ${orderNumber}</p>
          <p>Pesanan Anda sedang diproses oleh tim kami. Anda akan menerima notifikasi untuk update selanjutnya.</p>
        </div>
        <div class="footer">
          <p>© 2025 Tejoss. Platform Jasa Pertanian Terpercaya.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

module.exports = {
  sendEmail,
  emailTemplates
};
