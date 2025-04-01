import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import logo from '@/public/logo.svg';
export async function POST(request: Request) {
  try {
    const formData = await request.json();

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
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 40px;">
            <img src="https://aziz-fadel.vercel.app/logo.svg" alt="Aziz Fadel Logo" style="height: 60px; margin-bottom: 20px;">
            <h1 style="color: #1a1a1a; font-size: 28px; margin: 0; font-weight: bold;">طلب جديد للتسجيل</h1>
          </div>
          
          <!-- Customer Information Section -->
          <div style="background-color: #F8FAFC; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 25px 0; font-weight: bold; text-align: right;">معلومات العميل</h2>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 16px;">الاسم الأول</span>
                <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${formData.firstName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 16px;">اسم العائلة</span>
                <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${formData.lastName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 16px;">رقم الهاتف</span>
                <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${formData.countryCode}${formData.phone}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 16px;">البريد الإلكتروني</span>
                <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${formData.email}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 16px;">الدولة</span>
                <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${formData.country}</span>
              </div>
            </div>
          </div>

          <!-- Questionnaire Section -->
          <div style="background-color: #F8FAFC; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 25px 0; font-weight: bold; text-align: right;">إجابات الاستبيان</h2>
            ${formData.package.map((item: { question: string; answer: string }) => `
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
                <p style="color: #1a1a1a; font-size: 18px; margin: 0 0 10px 0; font-weight: bold;">${item.question}</p>
                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.5;">${item.answer}</p>
              </div>
            `).join('')}
          </div>

          <!-- Footer -->
          <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">تم إرسال هذا الطلب من خلال نموذج التسجيل</p>
            <p style="margin: 10px 0 0 0;">جميع الحقوق محفوظة © ${new Date().getFullYear()} Aziz Fadel</p>
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
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'تم إرسال البريد الإلكتروني بنجاح' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إرسال البريد الإلكتروني' },
      { status: 500 }
    );
  }
} 