import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    // Find user by ID
    let user = await User.findById(decoded.userId)
      .select('-password_hash -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');
    
    // If user is a provider, populate the provider profile
    if (user && user.role === 'provider') {
      user = await User.findById(decoded.userId)
        .select('-password_hash -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
        .populate('providerProfile', 'services_offered bio is_visible');
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    const body = await request.json();
    
    // Only allow updating certain fields
    const allowedUpdates = ['name', 'avatar_url', 'location'];
    const updates: any = {};
    
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password_hash -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
