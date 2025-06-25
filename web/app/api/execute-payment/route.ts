import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { price, firstName, lastName, email, phone, paymentMethodId } = await request.json();

    // MyFatoorah API configuration
    const apiKey = process.env.MYFATOORAH_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_MYFATOORAH_PROD_URL;

    // Execute Payment
    const response = await axios.post(
      `${baseUrl}/v2/ExecutePayment`,
      {
        PaymentMethodId: paymentMethodId,
        InvoiceValue: price,
        CallBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
        ErrorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error`,
        CustomerName: `${firstName} ${lastName}`,
        CustomerEmail: email,
        // CustomerMobile: phone.replace('+', ''), // this problem if number isnt kuwait
        Language: 'ar',
        DisplayCurrencyIso: 'USD',
        InvoiceReference: `INV-${Date.now()}`,
        CustomerReference: `${firstName}-${Date.now()}`,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.IsSuccess) {
      return NextResponse.json({
        success: true,
        paymentUrl: response.data.Data.PaymentURL,
        invoiceId: response.data.Data.InvoiceId,
      });
    } else {
      throw new Error(response.data.Message || 'Payment execution failed');
    }
  } catch (error: any) {
    console.error('Payment Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.Message || 'Failed to execute payment',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 