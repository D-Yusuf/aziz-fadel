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

    // Add user info at top right
    const userInfo = [
      `${formData.firstName} ${formData.lastName}`,
      formData.email,
      `${formData.countryCode}${formData.phone}`,
      `${new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`
    ];

    // Draw user info
    userInfo.forEach((info, index) => {
      const infoWidth = font.widthOfTextAtSize(info, 10);
      currentPage.drawText(info, {
        x: 550 - infoWidth,
        y: yPosition - (index * 15),
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4)
      });
    });
    yPosition -= 80;

    // Add questions and answers
    formData.package.forEach((item: { question: string; answer: string }) => {
      // Check if we need a new page
      if (yPosition < 100) {
        currentPage = createNewPage();
        yPosition = 800;
      }

      // Add question with larger text and bold styling
      const questionWidth = font.widthOfTextAtSize(item.question, 16);
      // Check if question needs to be wrapped
      if (questionWidth > 500) {
        const words = item.question.split(' ');
        let currentLine = '';
        let lines: string[] = [];
        
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const testWidth = font.widthOfTextAtSize(testLine, 16);
          
          if (testWidth > 500) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        lines.push(currentLine.trim());

        // Draw each line of the question
        lines.forEach(line => {
          if (yPosition < 100) {
            currentPage = createNewPage();
            yPosition = 800;
          }
          const lineWidth = font.widthOfTextAtSize(line, 16);
          currentPage.drawText(line, {
            x: 550 - lineWidth,
            y: yPosition,
            size: 16,
            font,
            color: rgb(0, 0, 0)
          });
          yPosition -= 30;
        });
      } else {
        currentPage.drawText(item.question, {
          x: 550 - questionWidth,
          y: yPosition,
          size: 16,
          font,
          color: rgb(0, 0, 0)
        });
        yPosition -= 30;
      }

      // Add answer with smaller text
      const answerWidth = font.widthOfTextAtSize(item.answer, 14);
      // Check if answer needs to be wrapped
      if (answerWidth > 500) {
        const words = item.answer.split(' ');
        let currentLine = '';
        let lines: string[] = [];
        
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const testWidth = font.widthOfTextAtSize(testLine, 14);
          
          if (testWidth > 500) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        lines.push(currentLine.trim());

        // Draw each line of the answer
        lines.forEach(line => {
          if (yPosition < 100) {
            currentPage = createNewPage();
            yPosition = 800;
          }
          const lineWidth = font.widthOfTextAtSize(line, 14);
          currentPage.drawText(line, {
            x: 550 - lineWidth,
            y: yPosition,
            size: 14,
            font,
            color: rgb(0.2, 0.2, 0.2)
          });
          yPosition -= 20;
        });
      } else {
        currentPage.drawText(item.answer, {
          x: 550 - answerWidth,
          y: yPosition,
          size: 14,
          font,
          color: rgb(0.2, 0.2, 0.2)
        });
        yPosition -= 20;
      }

      // Add spacing between Q&A pairs
      yPosition -= 20;
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
      <body dir="rtl" style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #111827; font-size: 32px; margin: 0; font-weight: 700;">طلب جديد للتسجيل</h1>
          </div>
          
          <!-- User Information -->
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0;">معلومات العميل</h2>
            <p style="margin: 8px 0; color: #4b5563;">الاسم: ${formData.firstName} ${formData.lastName}</p>
            <p style="margin: 8px 0; color: #4b5563;">البريد الإلكتروني: ${formData.email}</p>
            <p style="margin: 8px 0; color: #4b5563;">رقم الهاتف: ${formData.countryCode}${formData.phone}</p>
            <p style="margin: 8px 0; color: #4b5563;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>

          <!-- Questions and Answers -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0;">إجابات الاستبيان</h2>
            ${formData.package.map((item: { question: string; answer: string }) => `
              <div style="margin-bottom: 24px;">
                <h3 style="color: #111827; font-size: 16px; margin: 0 0 8px 0;">${item.question}</h3>
                <p style="color: #4b5563; margin: 0; line-height: 1.5;">${item.answer}</p>
              </div>
            `).join('')}
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
      to: process.env.EMAIL_USER,
      subject: 'تسجيل جديد',
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