import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Payment } from '@/models/Payment';
import PaystackService from '@/lib/paystack';
import Joi from 'joi';

const initiatePaymentSchema = Joi.object({
  order_id: Joi.string().required(),
  callback_url: Joi.string().uri().required()
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const { error, value } = initiatePaymentSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    const { order_id, callback_url } = value;
    
    // Extract user from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // For now, we'll use a placeholder userId - in production you'd verify the JWT token
    const userId = 'placeholder-user-id'; // This should be extracted from JWT token

    // Find the order
    const order = await Order.findById(order_id)
      .populate('user_id', 'email name')
      .populate('provider_id', 'name');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify user owns the order or is the provider
    if (order.user_id.toString() !== userId && order.provider_id.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    // Check if order is in pending status
    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Order is not in pending status' },
        { status: 400 }
      );
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ order_id });
    if (existingPayment) {
      return NextResponse.json(
        { success: false, error: 'Payment already initiated for this order' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `SK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize payment with Paystack
    const paymentData = {
      amount: order.total_amount,
      email: (order.user_id as any).email,
      reference,
      callback_url,
      metadata: {
        order_id: order._id.toString(),
        customer_name: (order.user_id as any).name,
        provider_name: (order.provider_id as any).name,
        service_name: order.service_details.service_name
      }
    };

    const paystackResponse = await PaystackService.initializePayment(paymentData);

    if (!paystackResponse.status) {
      throw new Error(paystackResponse.message || 'Failed to initialize payment');
    }

    // Create payment record
    const payment = new Payment({
      order_id: order._id,
      paystack_id: reference,
      amount: order.total_amount,
      status: 'pending',
      method: 'online'
    });

    await payment.save();

    // Update order payment status
    await Order.findByIdAndUpdate(order_id, {
      payment_status: 'pending'
    });

    return NextResponse.json({
      success: true,
      data: {
        payment_reference: reference,
        authorization_url: paystackResponse.data.authorization_url,
        amount: order.total_amount,
        order_id: order._id
      },
      message: 'Payment initiated successfully'
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
