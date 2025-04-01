import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    
    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Load and embed the Noto IKEA font
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoIKEAArabic-Regular.ttf');
    const fontBytes = await fs.promises.readFile(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    // Helper function to create a new page
    const createNewPage = () => {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      return page;
    };

    // Create first page
    let currentPage = createNewPage();
    let yPosition = 800;

    // Add title to first page
    const titleWidth = font.widthOfTextAtSize('إجابات الاستبيان', 28);
    currentPage.drawText('إجابات الاستبيان', {
      x: (595.28 - titleWidth) / 2,
      y: yPosition,
      size: 28,
      font,
      color: rgb(0, 0, 0)
    });
    yPosition -= 50;

    // Add questions and answers
    formData.package.forEach((item: { question: string; answer: string }) => {
      // Check if we need a new page
      if (yPosition < 100) {
        currentPage = createNewPage();
        yPosition = 800;
      }

      // Add question with larger text and bold styling
      const questionWidth = font.widthOfTextAtSize(item.question, 22);
      currentPage.drawText(item.question, {
        x: 550 - questionWidth,
        y: yPosition,
        size: 22,
        font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 40;

      // Add answer with smaller text
      const answerWidth = font.widthOfTextAtSize(item.answer, 16);
      currentPage.drawText(item.answer, {
        x: 550 - answerWidth,
        y: yPosition,
        size: 16,
        font,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 50;

      // Add a decorative line between Q&A pairs
      currentPage.drawLine({
        start: { x: 40, y: yPosition + 25 },
        end: { x: 550, y: yPosition + 25 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8)
      });
      yPosition -= 30;
    });

    // Get PDF as buffer
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب جديد للتسجيل</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 40px;">
            <img src="https://aziz-fadel.vercel.app/logo.svg" alt="Aziz Fadel Logo" style="height: 64px; margin-bottom: 24px;">
            <h1 style="color: #111827; font-size: 32px; margin: 0; font-weight: 700;">طلب جديد للتسجيل</h1>
          </div>
          
          <!-- Customer Information Section -->
          <div style="background-color: #f9fafb; padding: 32px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; font-size: 24px; margin: 0 0 24px 0; font-weight: 700; text-align: right;">معلومات العميل</h2>
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
                <span style="color: #4b5563; font-size: 18px;">الاسم الأول</span>
                <span style="color: #111827; font-size: 18px; font-weight: 500;">${formData.firstName}</span>
              </div>
              <br>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
                <span style="color: #4b5563; font-size: 18px;">اسم العائلة</span>
                <span style="color: #111827; font-size: 18px; font-weight: 500;">${formData.lastName}</span>
              </div>
              <br>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
                <span style="color: #4b5563; font-size: 18px;">رقم الهاتف</span>
                <span style="color: #111827; font-size: 18px; font-weight: 500;">${formData.countryCode}${formData.phone}</span>
              </div>
              <br>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
                <span style="color: #4b5563; font-size: 18px;">البريد الإلكتروني</span>
                <span style="color: #111827; font-size: 18px; font-weight: 500;">${formData.email}</span>
              </div>
              <br>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
                <span style="color: #4b5563; font-size: 18px;">الدولة</span>
                <span style="color: #111827; font-size: 18px; font-weight: 500;">${formData.country}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; color: #4b5563; font-size: 14px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">تم إرسال هذا الطلب من خلال نموذج التسجيل</p>
            <p style="margin: 8px 0 0 0;">جميع الحقوق محفوظة © ${new Date().getFullYear()} Aziz Fadel</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `"${formData.firstName} ${formData.lastName}" <${formData.email}>`,
      to: 'alnasiriyusuf@gmail.com',
      subject: 'طلب جديد للتسجيل',
      html: emailTemplate,
      replyTo: formData.email,
      attachments: [
        {
          filename: 'questions.pdf',
          content: Buffer.from(pdfBuffer)
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'تم إرسال البريد الإلكتروني بنجاح' });
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إرسال البريد الإلكتروني',
        error: error.message
      },
      { status: 500 }
    );
  }
} 