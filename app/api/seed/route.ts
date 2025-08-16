import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { ProviderProfile } from '@/models/ProviderProfile';
import { Service } from '@/models/Service';
import { Order } from '@/models/Order';
import { Review } from '@/models/Review';
import { cors, handleCors } from '@/lib/cors';
import bcrypt from 'bcryptjs';

// Mock data for services
const services = [
  'Electrical Installation',
  'Plumbing',
  'Carpentry',
  'House Cleaning',
  'Gardening & Landscaping',
  'Painting',
  'Appliance Repair',
  'Moving & Packing',
  'Security Installation',
  'Interior Design',
  'Roofing',
  'HVAC Maintenance',
  'Flooring Installation',
  'Window & Door Repair',
  'Furniture Assembly'
];

// Mock data for locations in Kenya
const locations = [
  {
    address: 'Westlands, Nairobi',
    coordinates: [36.8172, -1.2641]
  },
  {
    address: 'Kilimani, Nairobi',
    coordinates: [36.8089, -1.3031]
  },
  {
    address: 'Lavington, Nairobi',
    coordinates: [36.8125, -1.2986]
  },
  {
    address: 'Karen, Nairobi',
    coordinates: [36.7089, -1.3187]
  },
  {
    address: 'Muthaiga, Nairobi',
    coordinates: [36.8347, -1.2444]
  },
  {
    address: 'Upperhill, Nairobi',
    coordinates: [36.8147, -1.2931]
  },
  {
    address: 'South B, Nairobi',
    coordinates: [36.8236, -1.3086]
  },
  {
    address: 'Embakasi, Nairobi',
    coordinates: [36.9333, -1.3000]
  },
  {
    address: 'Donholm, Nairobi',
    coordinates: [36.8667, -1.2833]
  },
  {
    address: 'Buruburu, Nairobi',
    coordinates: [36.8667, -1.2833]
  }
];

// Mock service providers data
const serviceProviders = [
  {
    name: 'John Kamau',
    email: 'john.kamau@saka-kazi.com',
    phone: '+254710101010',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: locations[0],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['Electrical Installation', 'Appliance Repair'],
    bio: 'Licensed electrician with 8+ years of experience. Specializing in residential and commercial electrical installations. Available 24/7 for emergency repairs.',
    rate_card: [
      { service: 'Electrical Installation', rate: 2500, unit: 'per job' },
      { service: 'Appliance Repair', rate: 1500, unit: 'per hour' }
    ]
  },
  {
    name: 'Sarah Wanjiku',
    email: 'sarah.wanjiku@saka-kazi.com',
    phone: '+254710101011',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: locations[1],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['House Cleaning', 'Interior Design'],
    bio: 'Professional housekeeper and interior designer. Creating clean, beautiful spaces that feel like home. Eco-friendly cleaning products used.',
    rate_card: [
      { service: 'House Cleaning', rate: 2000, unit: 'per session' },
      { service: 'Interior Design Consultation', rate: 5000, unit: 'per hour' }
    ]
  },
  {
    name: 'David Ochieng',
    email: 'david.ochieng@saka-kazi.com',
    phone: '+254710101012',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: locations[2],
    gold_member: false,
    is_verified: true,
    status: 'active',
    services_offered: ['Plumbing', 'HVAC Maintenance'],
    bio: 'Master plumber with expertise in modern plumbing systems and HVAC maintenance. Quick response time and quality work guaranteed.',
    rate_card: [
      { service: 'Plumbing Repair', rate: 1800, unit: 'per hour' },
      { service: 'HVAC Maintenance', rate: 3000, unit: 'per service' }
    ]
  },
  {
    name: 'Grace Akinyi',
    email: 'grace.akinyi@saka-kazi.com',
    phone: '+254710101013',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: locations[3],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['Gardening & Landscaping', 'House Cleaning'],
    bio: 'Passionate gardener and landscape designer. Transforming outdoor spaces into beautiful, sustainable gardens. Also offers eco-friendly cleaning services.',
    rate_card: [
      { service: 'Garden Maintenance', rate: 2500, unit: 'per session' },
      { service: 'Landscape Design', rate: 15000, unit: 'per project' }
    ]
  },
  {
    name: 'Michael Odhiambo',
    email: 'michael.odhiambo@saka-kazi.com',
    phone: '+254710101014',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    location: locations[4],
    gold_member: false,
    is_verified: true,
    status: 'active',
    services_offered: ['Carpentry', 'Furniture Assembly'],
    bio: 'Skilled carpenter with 12 years of experience. Specializing in custom furniture, repairs, and installations. Quality craftsmanship guaranteed.',
    rate_card: [
      { service: 'Carpentry Work', rate: 2000, unit: 'per hour' },
      { service: 'Furniture Assembly', rate: 1200, unit: 'per piece' }
    ]
  },
  {
    name: 'Lucy Muthoni',
    email: 'lucy.muthoni@saka-kazi.com',
    phone: '+254710101015',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    location: locations[5],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['Painting', 'Interior Design'],
    bio: 'Professional painter and interior designer. Creating beautiful, lasting finishes for homes and businesses. Color consultation included.',
    rate_card: [
      { service: 'Interior Painting', rate: 1800, unit: 'per square meter' },
      { service: 'Exterior Painting', rate: 2200, unit: 'per square meter' }
    ]
  },
  {
    name: 'Peter Kiprop',
    email: 'peter.kiprop@saka-kazi.com',
    phone: '+254710101016',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: locations[6],
    gold_member: false,
    is_verified: true,
    status: 'active',
    services_offered: ['Moving & Packing', 'Security Installation'],
    bio: 'Professional mover and security specialist. Safe, efficient moving services and modern security system installations. Licensed and insured.',
    rate_card: [
      { service: 'Moving & Packing', rate: 8000, unit: 'per room' },
      { service: 'Security Installation', rate: 15000, unit: 'per system' }
    ]
  },
  {
    name: 'Ann Njeri',
    email: 'ann.njeri@saka-kazi.com',
    phone: '+254710101017',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    location: locations[7],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['House Cleaning', 'Gardening & Landscaping'],
    bio: 'Dedicated housekeeper and gardener. Providing comprehensive home maintenance services. Available for regular and one-time services.',
    rate_card: [
      { service: 'Deep Cleaning', rate: 3500, unit: 'per session' },
      { service: 'Garden Maintenance', rate: 2000, unit: 'per session' }
    ]
  },
  {
    name: 'James Mutua',
    email: 'james.mutua@saka-kazi.com',
    phone: '+254710101018',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: locations[8],
    gold_member: false,
    is_verified: true,
    status: 'active',
    services_offered: ['Roofing', 'Flooring Installation'],
    bio: 'Expert roofer and flooring specialist. Quality installations and repairs for all types of roofs and flooring materials.',
    rate_card: [
      { service: 'Roof Repair', rate: 5000, unit: 'per square meter' },
      { service: 'Flooring Installation', rate: 3500, unit: 'per square meter' }
    ]
  },
  {
    name: 'Mary Wambui',
    email: 'mary.wambui@saka-kazi.com',
    phone: '+254710101019',
    role: 'provider',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    location: locations[9],
    gold_member: true,
    is_verified: true,
    status: 'active',
    services_offered: ['Window & Door Repair', 'Appliance Repair'],
    bio: 'Skilled technician specializing in window, door, and appliance repairs. Quick fixes and long-term solutions for your home.',
    rate_card: [
      { service: 'Window Repair', rate: 1500, unit: 'per window' },
      { service: 'Appliance Repair', rate: 2000, unit: 'per hour' }
    ]
  }
];

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@saka-kazi.com',
  phone: '+254700000000',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  location: {
    address: 'Nairobi, Kenya',
    coordinates: [36.8172, -1.2641]
  },
  gold_member: false,
  is_verified: true,
  status: 'active'
};

// Test customer user data
const testCustomer = {
  name: 'Test Customer',
  email: 'customer@saka-kazi.com',
  phone: '+254711111111',
  role: 'customer',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  location: {
    address: 'Westlands, Nairobi',
    coordinates: [36.8172, -1.2641]
  },
  gold_member: false,
  is_verified: true,
  status: 'active'
};

function getServiceCategory(serviceName: string): string {
  const categories: { [key: string]: string } = {
    'Electrical Installation': 'electrical',
    'Plumbing': 'plumbing',
    'Carpentry': 'carpentry',
    'House Cleaning': 'cleaning',
    'Gardening & Landscaping': 'landscaping',
    'Painting': 'painting',
    'Appliance Repair': 'repair',
    'Moving & Packing': 'moving',
    'Security Installation': 'security',
    'Interior Design': 'other',
    'Roofing': 'carpentry',
    'HVAC Maintenance': 'maintenance',
    'Flooring Installation': 'carpentry',
    'Window & Door Repair': 'repair',
    'Furniture Assembly': 'carpentry'
  };
  return categories[serviceName] || 'other';
}

export async function GET(request: NextRequest) {
  try {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;
    
    await connectDB();
    
    const counts = {
      users: await User.countDocuments(),
      services: await Service.countDocuments(),
      providerProfiles: await ProviderProfile.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments()
    };

    return NextResponse.json({
      success: true,
      counts,
      message: 'Database status retrieved successfully'
    }, {
      headers: cors(request)
    });
  } catch (error) {
    console.error('Error getting database status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get database status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;
    
    await connectDB();

    const results = {
      services: { created: 0, existing: 0 },
      users: { created: 0, existing: 0 },
      providerProfiles: { created: 0, existing: 0 },
      orders: { created: 0, existing: 0 },
      reviews: { created: 0, existing: 0 }
    };

    // Create services if they don't exist
    for (const serviceName of services) {
      const existingService = await Service.findOne({ name: serviceName });
      if (!existingService) {
        await Service.create({
          name: serviceName,
          description: `Professional ${serviceName.toLowerCase()} services`,
          category: getServiceCategory(serviceName),
          is_active: true
        });
        results.services.created++;
      } else {
        results.services.existing++;
      }
    }

    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: adminUser.email });
    if (!admin) {
      admin = await User.create({
        ...adminUser,
        password_hash: 'admin123' // Will be hashed by pre-save middleware
      });
      results.users.created++;
    } else {
      results.users.existing++;
    }

    // Create test customer if doesn't exist
    let customer = await User.findOne({ email: testCustomer.email });
    if (!customer) {
      customer = await User.create({
        ...testCustomer,
        password_hash: 'customer123' // Will be hashed by pre-save middleware
      });
      results.users.created++;
    } else {
      results.users.existing++;
    }

    // Create service providers and their profiles
    const createdProviders: any[] = [];
    for (const providerData of serviceProviders) {
      let provider = await User.findOne({ email: providerData.email });
      
      if (!provider) {
        provider = await User.create({
          ...providerData,
          password_hash: 'provider123' // Will be hashed by pre-save middleware
        });
        results.users.created++;

        // Create provider profile
        await ProviderProfile.create({
          user_id: provider._id.toString(),
          services_offered: providerData.services_offered,
          bio: providerData.bio,
          is_visible: true
        });
        results.providerProfiles.created++;
      } else {
        results.users.existing++;
        
        // Check if provider profile exists
        const existingProfile = await ProviderProfile.findOne({ user_id: provider._id.toString() });
        if (!existingProfile) {
          await ProviderProfile.create({
            user_id: provider._id.toString(),
            services_offered: providerData.services_offered,
            bio: providerData.bio,
            is_visible: true
          });
          results.providerProfiles.created++;
        } else {
          results.providerProfiles.existing++;
        }
      }
      
      createdProviders.push(provider);
    }

    // Get all services and providers for sample data
    const allServices = await Service.find({});
    const allProviders = await User.find({ role: 'provider' });

    // Create sample orders if they don't exist
    const sampleOrders = [
      {
        user_id: customer._id.toString(),
        provider_id: allProviders[0]?._id.toString(),
        service_id: allServices[0]?._id.toString(),
        status: 'completed',
        payment_status: 'paid',
        paid_on: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        location: {
          type: 'Point',
          coordinates: [36.8172, -1.2641],
          address: 'Westlands, Nairobi'
        },
        activation_fee: 500,
        total_amount: 3500,
        service_details: {
          service_name: 'House Cleaning',
          description: 'Deep cleaning of 3-bedroom apartment',
          rate: 2000,
          quantity: 1
        }
      },
      {
        user_id: customer._id.toString(),
        provider_id: allProviders[1]?._id.toString(),
        service_id: allServices[1]?._id.toString(),
        status: 'active',
        payment_status: 'paid',
        paid_on: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: {
          type: 'Point',
          coordinates: [36.8089, -1.3031],
          address: 'Kilimani, Nairobi'
        },
        activation_fee: 500,
        total_amount: 5500,
        service_details: {
          service_name: 'Interior Design Consultation',
          description: '2-hour interior design consultation',
          rate: 5000,
          quantity: 1
        }
      }
    ];

    for (const orderData of sampleOrders) {
      const existingOrder = await Order.findOne({
        user_id: orderData.user_id,
        provider_id: orderData.provider_id,
        'service_details.service_name': orderData.service_details.service_name
      });

      if (!existingOrder && orderData.provider_id && orderData.service_id) {
        await Order.create(orderData);
        results.orders.created++;
      } else {
        results.orders.existing++;
      }
    }

    // Create sample reviews if they don't exist
    const createdOrders = await Order.find({});
    const sampleReviews = [
      {
        order_id: createdOrders[0]?._id.toString(),
        user_id: customer._id.toString(),
        provider_id: allProviders[0]?._id.toString(),
        rating: 5,
        review: 'Excellent service! The house was spotless after cleaning. Very professional and punctual.',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        order_id: createdOrders[1]?._id.toString(),
        user_id: customer._id.toString(),
        provider_id: allProviders[1]?._id.toString(),
        rating: 4,
        review: 'Great interior design advice. Helped me transform my living room completely.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const reviewData of sampleReviews) {
      if (reviewData.order_id && reviewData.provider_id) {
        const existingReview = await Review.findOne({ order_id: reviewData.order_id });
        if (!existingReview) {
          await Review.create(reviewData);
          results.reviews.created++;
        } else {
          results.reviews.existing++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
      credentials: {
        admin: { email: adminUser.email, password: 'admin123' },
        customer: { email: testCustomer.email, password: 'admin123' },
        providers: serviceProviders.map(p => ({ email: p.email, password: 'provider123' }))
      }
    }, {
      headers: cors(request)
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;
    
    await connectDB();
    
    // Clear all collections with better error handling
    const results = {
      users: 0,
      services: 0,
      providerProfiles: 0,
      orders: 0,
      reviews: 0
    };
    
    try {
      results.users = await User.deleteMany({}).then(res => res.deletedCount || 0);
    } catch (e) {
      console.error('Error deleting users:', e);
    }
    
    try {
      results.services = await Service.deleteMany({}).then(res => res.deletedCount || 0);
    } catch (e) {
      console.error('Error deleting services:', e);
    }
    
    try {
      results.providerProfiles = await ProviderProfile.deleteMany({}).then(res => res.deletedCount || 0);
    } catch (e) {
      console.error('Error deleting provider profiles:', e);
    }
    
    try {
      results.orders = await Order.deleteMany({}).then(res => res.deletedCount || 0);
    } catch (e) {
      console.error('Error deleting orders:', e);
    }
    
    try {
      results.reviews = await Review.deleteMany({}).then(res => res.deletedCount || 0);
    } catch (e) {
      console.error('Error deleting reviews:', e);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database cleared successfully',
      deleted: results
    }, {
      headers: cors(request)
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: cors(request),
  });
}
