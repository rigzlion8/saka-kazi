import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';
import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export async function POST(request: NextRequest) {
  try {
    console.log('Login API: Starting login process...');
    
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const { error, value } = loginSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, password } = value;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('User found:', { email: user.email, role: user.role, status: user.status });

    // Check if user is active
    if (user.status !== 'active') {
      console.log('Login failed: User status is not active:', user.status);
      return NextResponse.json(
        { success: false, error: 'Account is suspended or banned' },
        { status: 403 }
      );
    }

    // Verify password
    console.log('Attempting password comparison for user:', email);
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


