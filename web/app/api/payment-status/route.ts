import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    // MyFatoorah API configuration
    const apiKey = process.env.MYFATOORAH_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_MYFATOORAH_PROD_URL;

    // Get payment status
    const response = await axios.post(
      `${baseUrl}/v2/GetPaymentStatus`,
      {
        Key: paymentId,
        KeyType: 'PaymentId',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.IsSuccess) {
      const paymentStatus = response.data.Data.InvoiceStatus;
      const message = response.data.Message;
      
      return NextResponse.json({
        success: true,
        status: paymentStatus,
        message: message,
        data: response.data.Data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: response.data.Message || 'Failed to get payment status',
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Payment Status Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.Message || 'Failed to get payment status',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 