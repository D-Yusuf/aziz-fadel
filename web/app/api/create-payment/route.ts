import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { price } = await request.json();

    // MyFatoorah API configuration
    const apiKey = process.env.MYFATOORAH_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_MYFATOORAH_TEST_URL;

    // Step 1: Initiate Payment to get available payment methods
    const initiateResponse = await axios.post(
      `${baseUrl}/v2/InitiatePayment`,
      {
        InvoiceAmount: price,
        CurrencyIso: 'KWD',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!initiateResponse.data.IsSuccess) {
      throw new Error(initiateResponse.data.Message || 'Failed to initiate payment');
    }



    // Return the selected payment methods
    return NextResponse.json({
      success: true,
      paymentMethods: initiateResponse.data.Data.PaymentMethods,
    });
  } catch (error: any) {
    console.error('Payment Error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.Message || 'Failed to create payment',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 