const PDFDocument = require("pdfkit");
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

module.exports = generateCertificate;