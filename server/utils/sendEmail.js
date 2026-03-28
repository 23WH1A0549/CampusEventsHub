const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const sendRegistrationEmail = async (userEmail, event) => {
  try {
    console.log("📩 Sending email to:", userEmail);

    // 🎯 Create QR data
    const qrData = JSON.stringify({
      email: userEmail,
      eventId: event._id,
      eventName: event.title,
    });

    // 🎯 Generate QR as base64
    const qrImage = await QRCode.toDataURL(qrData);

    // 📧 Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📨 Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎉 Registration Confirmed - ${event.title}`,

      html: `
        <h2>Thank you for registering! 🎉</h2>

        <p>You have successfully registered for:</p>

        <h3>${event.title}</h3>

        <p><b>📅 Date:</b> ${new Date(event.date).toDateString()}</p>
        <p><b>🕒 Time:</b> ${event.startTime} - ${event.endTime}</p>
        <p><b>📍 Venue:</b> ${event.venue}</p>

        <h3>📌 Your Entry QR Code:</h3>

        <!-- ✅ Show QR in email -->
        <img src="cid:qrcodecid" width="200" />

        <p>⚠️ Show this QR code at the event for attendance.</p>

        <br/>
        <p>See you at the event! 🚀</p>
      `,

      // ✅ Attach QR image
      attachments: [
        {
          filename: "qrcode.png", // 👉 auto-generated name
          path: qrImage,          // 👉 this is GENERATED QR (no URL needed)
          cid: "qrcodecid",       // 👉 link to <img src="cid:...">
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.log("❌ Email Error:", err);
  }
};

module.exports = sendRegistrationEmail;