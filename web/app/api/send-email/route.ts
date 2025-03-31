import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">طلب جديد للتسجيل</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #444; margin-bottom: 15px;">معلومات العميل</h3>
          <p><strong>الاسم الأول:</strong> ${formData.firstName}</p>
          <p><strong>اسم العائلة:</strong> ${formData.lastName}</p>
          <p><strong>رقم الهاتف:</strong> ${formData.countryCode}${formData.phone}</p>
          <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
          <p><strong>الدولة:</strong> ${formData.country}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #444; margin-bottom: 15px;">إجابات الاستبيان</h3>
          ${formData.package.map((item: { question: string; answer: string }) => `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              <p style="margin: 0;"><strong>${item.question}</strong></p>
              <p style="margin: 5px 0 0 0; color: #666;">${item.answer}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; text-align: center; color: #666;">
          <p>تم إرسال هذا الطلب من خلال نموذج التسجيل</p>
        </div>
      </div>
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