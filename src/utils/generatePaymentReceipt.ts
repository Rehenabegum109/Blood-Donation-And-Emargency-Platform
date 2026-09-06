import PDFDocument from "pdfkit";

interface PaymentReceiptData {
  paymentId: string;
  transactionId: string;
  amount: string;
  currency: string;
  method: string;
  paidAt: Date;
  bloodRequestId: string;
}

export const generatePaymentReceipt = (
  data: PaymentReceiptData
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", (error) => {
      reject(error);
    });

    // Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("BloodLink Payment Receipt", {
        align: "center",
      });

    doc.moveDown(2);

    // Payment information
    doc
      .fontSize(12)
      .font("Helvetica");

    doc.text(`Payment ID: ${data.paymentId}`);
    doc.moveDown(0.5);

    doc.text(`Transaction ID: ${data.transactionId}`);
    doc.moveDown(0.5);

    doc.text(`Blood Request ID: ${data.bloodRequestId}`);
    doc.moveDown(0.5);

    doc.text(`Amount: ${data.amount} ${data.currency}`);
    doc.moveDown(0.5);

    doc.text(`Payment Method: ${data.method}`);
    doc.moveDown(0.5);

    doc.text(
      `Paid At: ${data.paidAt.toISOString()}`
    );

    doc.moveDown(2);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Payment Status: PAID", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        "Thank you for using BloodLink.",
        {
          align: "center",
        }
      );

    doc.end();
  });
};