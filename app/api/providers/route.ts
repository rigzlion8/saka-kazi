import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const service = searchParams.get('service');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query for providers
    const query: any = {
      role: 'provider',
      status: 'active'
    };

    // Add location filter if provided
    if (location) {
      // For now, we'll do a simple text search on location address
      // In production, you'd want to implement proper geospatial queries
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    // Find providers
    const providers = await User.find(query)
      .select('-password_hash -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
      .populate('providerProfile', 'services_offered bio is_visible')
      .limit(limit)
      .skip(skip)
      .sort({ gold_member: -1, is_verified: -1, created_at: -1 });

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Filter by service if provided
    let filteredProviders = providers;
    if (service) {
      filteredProviders = providers.filter(provider => 
        provider.providerProfile?.services_offered?.some((s: string) => 
          s.toLowerCase().includes(service.toLowerCase())
        )
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        providers: filteredProviders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
