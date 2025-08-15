import axios from 'axios';
import { PaystackPaymentRequest, PaystackPaymentResponse, PaystackWebhookData } from '@/types';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY!;

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
  throw new Error('Paystack API keys are not defined in environment variables');
}

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export class PaystackService {
  /**
   * Initialize a payment transaction
   */
  static async initializePayment(paymentData: PaystackPaymentRequest): Promise<PaystackPaymentResponse> {
    try {
      const response = await paystackApi.post('/transaction/initialize', {
        amount: paymentData.amount * 100, // Convert to kobo (smallest currency unit)
        email: paymentData.email,
        reference: paymentData.reference,
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata || {},
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to initialize payment');
    }
  }

  /**
   * Verify a payment transaction
   */
  static async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await paystackApi.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Get transaction details
   */
  static async getTransaction(reference: string): Promise<any> {
    try {
      const response = await paystackApi.get(`/transaction/${reference}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to get transaction details');
    }
  }

  /**
   * List transactions
   */
  static async listTransactions(page: number = 1, perPage: number = 50): Promise<any> {
    try {
      const response = await paystackApi.get('/transaction', {
        params: {
          page,
          perPage,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to list transactions');
    }
  }

  /**
   * Create a customer
   */
  static async createCustomer(email: string, firstName?: string, lastName?: string, phone?: string): Promise<any> {
    try {
      const response = await paystackApi.post('/customer', {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Get customer details
   */
  static async getCustomer(customerId: string): Promise<any> {
    try {
      const response = await paystackApi.get(`/customer/${customerId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to get customer details');
    }
  }

  /**
   * Update customer
   */
  static async updateCustomer(customerId: string, updateData: any): Promise<any> {
    try {
      const response = await paystackApi.put(`/customer/${customerId}`, updateData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to update customer');
    }
  }

  /**
   * Create a plan for recurring payments
   */
  static async createPlan(
    name: string,
    amount: number,
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly',
    description?: string
  ): Promise<any> {
    try {
      const response = await paystackApi.post('/plan', {
        name,
        amount: amount * 100, // Convert to kobo
        interval,
        description,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to create plan');
    }
  }

  /**
   * Initialize a subscription
   */
  static async initializeSubscription(
    email: string,
    planCode: string,
    reference: string,
    callbackUrl: string
  ): Promise<any> {
    try {
      const response = await paystackApi.post('/subscription', {
        customer: email,
        plan: planCode,
        authorization: reference,
        start_date: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to initialize subscription');
    }
  }

  /**
   * Validate webhook signature
   */
  static validateWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(payload)
      .digest('hex');
    
    return hash === signature;
  }

  /**
   * Parse webhook data
   */
  static parseWebhookData(payload: string): PaystackWebhookData {
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Invalid webhook payload');
    }
  }

  /**
   * Handle successful payment webhook
   */
  static async handleSuccessfulPayment(webhookData: PaystackWebhookData): Promise<void> {
    // This method would typically update the order status and trigger notifications
    // Implementation depends on your business logic
    console.log('Payment successful:', webhookData.data.reference);
  }

  /**
   * Handle failed payment webhook
   */
  static async handleFailedPayment(webhookData: PaystackWebhookData): Promise<void> {
    // This method would typically update the order status and trigger notifications
    // Implementation depends on your business logic
    console.log('Payment failed:', webhookData.data.reference);
  }
}

export default PaystackService;
