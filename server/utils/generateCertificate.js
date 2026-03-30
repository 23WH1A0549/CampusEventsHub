/*const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = (name, eventTitle) => {
  return new Promise((resolve, reject) => {

    const collegeName = "BVRIT Hyderabad College of Engineering for Women";

    const safeName = name.replace(/\s+/g, "_");
    const safeEvent = eventTitle.replace(/\s+/g, "_");

    const fileName = `${safeName}-${safeEvent}.pdf`;

    const filePath = path.join(__dirname, "../certificates", fileName);

    const doc = new PDFDocument({
  size: "A4",
  layout: "landscape",
  margin: 30
});

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke("#2c3e50");

    // College Name
    doc.fontSize(28).fillColor("#1a237e")
       .text(collegeName.toUpperCase(), { align: "center" });

    doc.moveDown();

    // Title
    doc.fontSize(36).text("CERTIFICATE OF PARTICIPATION", { align: "center" });

    doc.moveDown(1.5);

    doc.fontSize(18).text("This is to certify that", { align: "center" });

    doc.moveDown();

    doc.fontSize(30)
       .text(name.toUpperCase(), { align: "center", underline: true });

    doc.moveDown(1.5);

    doc.fontSize(18)
       .text("has successfully participated in the event", { align: "center" });

    doc.moveDown();

    doc.fontSize(24)
       .fillColor("green")
       .text(`"${eventTitle}"`, { align: "center" });

    doc.moveDown(1.5);

    doc.fontSize(16)
       .fillColor("#444")
       .text(`organized by ${collegeName}`, { align: "center" });

    doc.moveDown(1);

    doc.fontSize(14)
       .text(`Date: ${new Date().toDateString()}`, { align: "center" });

    // Signature
    doc.moveDown(2);
    doc.moveTo(200, 450).lineTo(400, 450).stroke();
    doc.text("Authorized Signature", 200, 460);

    doc.end();

    stream.on("finish", () => resolve(fileName));
    stream.on("error", reject);
  });
};

module.exports = generateCertificate;*/
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const generateCertificate = async (name, eventTitle) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collegeName = "BVRIT Hyderabad College of Engineering for Women";

      const safeName = name.replace(/\s+/g, "_");
      const safeEvent = eventTitle.replace(/\s+/g, "_");

      const fileName = `${safeName}-${safeEvent}.pdf`;
      const filePath = path.join(__dirname, "../certificates", fileName);

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // 🎨 Background
      doc.rect(0, 0, pageWidth, pageHeight).fill("#fdf6e3");

      // 🟦 Outer Border
      doc.lineWidth(6)
        .strokeColor("#0d47a1")
        .rect(20, 20, pageWidth - 40, pageHeight - 40)
        .stroke();

      // 🟨 Inner Border
      doc.lineWidth(2)
        .strokeColor("#d4af37")
        .rect(30, 30, pageWidth - 60, pageHeight - 60)
        .stroke();

      // 🏫 College Name
      doc.fillColor("#0d47a1")
        .fontSize(26)
        .text(collegeName.toUpperCase(), 0, 60, { align: "center" });

      // 📜 Title
      doc.fontSize(42)
        .fillColor("#d4af37")
        .text("CERTIFICATE", { align: "center" });

      doc.fontSize(20)
        .fillColor("#000")
        .text("OF PARTICIPATION", { align: "center" });

      // Decorative line
      // doc.moveTo(pageWidth / 2 - 180, 150)
      //   .lineTo(pageWidth / 2 + 180, 150)
      //   .strokeColor("#d4af37")
      //   .lineWidth(2)
      //   .stroke();

      // 📄 TEXT (FIXED POSITIONS)

      doc.fontSize(18)
        .fillColor("#333")
        .text("This is to proudly certify that", 0, 200, {
          align: "center"
        });

      // 👤 NAME
      const nameY = 240;
      const nameText = name.toUpperCase();
      const nameWidth = doc.widthOfString(nameText);

      doc.fontSize(34)
        .fillColor("#0d47a1")
        .text(nameText, pageWidth / 2 - nameWidth / 2, nameY);

      // Line BELOW name
      doc.moveTo(pageWidth / 2 - 250, nameY + 35)
        .lineTo(pageWidth / 2 + 250, nameY + 35)
        .strokeColor("#0d47a1")
        .lineWidth(2)
        .stroke();

      // CENTER MESSAGE
      doc.fontSize(18)
        .fillColor("#333")
        .text("has successfully participated in", 0, 300, {
          align: "center"
        });

      // 🎯 EVENT NAME
      doc.fontSize(26)
        .fillColor("#d4af37")
        .text(`"${eventTitle}"`, 0, 330, {
          align: "center"
        });

      // Organizer
      // doc.fontSize(16)
      //   .fillColor("#555")
      //   .text(`Organized by ${collegeName}`, 0, 380, {
      //     align: "center"
      //   });

      // Date
      const date = new Date().toDateString();
      doc.fontSize(14)
        .text(`Date: ${date}`, 0, 410, {
          align: "center"
        });

      // Certificate ID
      const certId = "CERT-" + Date.now();
      doc.fontSize(12)
        .text(`Certificate ID: ${certId}`, 60, 500);

      // 🔳 QR Code
      const qrData = `Certificate ID: ${certId}\nName: ${name}\nEvent: ${eventTitle}`;
      const qrImage = await QRCode.toDataURL(qrData);

      doc.image(qrImage, pageWidth - 130, 380, { width: 80 });

      // ✍ SIGNATURES (PERFECT ALIGNMENT)

      const sigY = 440;

      // LEFT SIGN
      doc.moveTo(150, sigY)
      //  .lineTo(350, sigY)
        .strokeColor("#0d47a1")
       // .lineWidth(2)
        .stroke();

      doc.fontSize(14)
        .fillColor("#000")
        .text("L. Alekhya", 150, sigY - 8, {
          width: 200,
          align: "center"
        });

      doc.fontSize(12)
        .text("Coordinator", 150, sigY + 10, {
          width: 200,
          align: "center"
        });

      // RIGHT SIGN
      doc.moveTo(pageWidth - 350, sigY)
      //  .lineTo(pageWidth - 150, sigY)
        .stroke();

      doc.fontSize(14)
        .text("M. Vaishnavi", pageWidth - 350, sigY - 8, {
          width: 200,
          align: "center"
        });

      doc.fontSize(12)
        .text("Coordinator", pageWidth - 350, sigY + 10, {
          width: 200,
          align: "center"
        });

      doc.end();

      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateCertificate;