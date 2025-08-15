import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generatePasswordResetToken } from '@/lib/auth';
import Joi from 'joi';

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const { error, value } = forgotPasswordSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    const { email } = value;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken(user._id.toString());
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Store reset token in user document
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // TODO: Send email with reset link
    // For now, we'll just return the token (remove this in production)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    // In production, send email here instead of returning the link
    console.log('Password reset link:', resetLink);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
