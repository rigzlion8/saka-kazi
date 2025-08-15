export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  avatar_url?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  gold_member?: boolean;
  is_verified?: boolean;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ProviderProfile {
  _id: string;
  user_id: string;
  certification?: string;
  services_offered: string[];
  rate_card_url?: string;
  is_visible: boolean;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RateCard {
  _id: string;
  provider_id: string;
  data: RateCardItem[];
  uploaded_at: Date;
}

export interface RateCardItem {
  service_name: string;
  description?: string;
  rate: number;
  unit: string; // per hour, per job, etc.
  category: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at: Date;
}

export interface Order {
  _id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  paid_on?: Date;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  activation_fee: number;
  total_amount: number;
  service_details: {
    service_name: string;
    description: string;
    rate: number;
    quantity: number;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  _id: string;
  order_id: string;
  paystack_id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  _id: string;
  order_id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  review: string;
  created_at: Date;
}

export interface Complaint {
  _id: string;
  reporter_id: string;
  target_id: string;
  order_id?: string;
  note: string;
  status: ComplaintStatus;
  created_at: Date;
  updated_at: Date;
}

export interface MarketplaceAd {
  _id: string;
  user_id: string;
  title: string;
  description: string;
  image_urls: string[];
  contact_info: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  _id: string;
  user_id: string;
  type: NotificationType;
  subject: string;
  message: string;
  read_status: boolean;
  created_at: Date;
}

export interface FinancialTransaction {
  _id: string;
  transaction_id: string;
  type: TransactionType;
  details: Record<string, any>;
  amount: number;
  created_at: Date;
}

// Enums
export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin',
  OPS = 'ops',
  FINANCE = 'finance'
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum OrderStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export enum ComplaintStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

export enum NotificationType {
  IN_APP = 'in-app',
  EMAIL = 'email'
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
  TAX = 'tax',
  COMMISSION = 'commission'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

// Paystack Types
export interface PaystackPaymentRequest {
  amount: number;
  email: string;
  reference: string;
  callback_url: string;
  metadata?: Record<string, any>;
}

export interface PaystackPaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackWebhookData {
  event: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    gateway_response: string;
    paid_at: string;
    channel: string;
    ip_address: string;
    metadata: Record<string, any>;
  };
}
