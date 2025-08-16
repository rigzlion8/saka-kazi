import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';
import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().custom((value, helpers) => {
    // Remove spaces and validate Kenyan phone format
    const cleanPhone = value.replace(/\s/g, '');
    const phonePattern = /^(\+254|0)[17]\d{8}$/;
    
    if (!phonePattern.test(cleanPhone)) {
      return helpers.error('any.invalid');
    }
    
    return cleanPhone; // Return cleaned phone number
  }, 'phone validation').required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'provider').default('customer'),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).default([0, 0]),
    address: Joi.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const { error, value } = registerSchema.validate(body);
    if (error) {
      console.log('Validation error:', error.details);
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, location } = value;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password_hash: password, // Will be hashed by pre-save middleware
      role,
      location: location || {
        type: 'Point',
        coordinates: [0, 0],
        address: ''
      }
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Return user data and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      location: user.location,
      gold_member: user.gold_member,
      is_verified: user.is_verified,
      status: user.status,
      created_at: user.created_at
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
