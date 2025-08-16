const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saka-kazi';

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

// Sample orders data
const sampleOrders = [
  {
    user_id: 'test-customer-id', // Will be replaced with actual user ID
    provider_id: 'provider-1-id', // Will be replaced with actual provider ID
    service_id: 'service-1-id', // Will be replaced with actual service ID
    status: 'completed',
    payment_status: 'paid',
    paid_on: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
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
    user_id: 'test-customer-id',
    provider_id: 'provider-2-id',
    service_id: 'service-2-id',
    status: 'active',
    payment_status: 'paid',
    paid_on: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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

// Sample reviews data
const sampleReviews = [
  {
    order_id: 'order-1-id',
    user_id: 'test-customer-id',
    provider_id: 'provider-1-id',
    rating: 5,
    review: 'Excellent service! The house was spotless after cleaning. Very professional and punctual.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    order_id: 'order-2-id',
    user_id: 'test-customer-id',
    provider_id: 'provider-2-id',
    rating: 4,
    review: 'Great interior design advice. Helped me transform my living room completely.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (individual collections instead of dropping database)
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('providerprofiles').deleteMany({});
    await mongoose.connection.db.collection('orders').deleteMany({});
    await mongoose.connection.db.collection('payments').deleteMany({});
    await mongoose.connection.db.collection('services').deleteMany({});
    await mongoose.connection.db.collection('reviews').deleteMany({});
    console.log('Cleared existing collections');

    // Import models
    const User = require('../models/User');
    const ProviderProfile = require('../models/ProviderProfile');
    const Order = require('../models/Order');
    const Review = require('../models/Review');
    const Service = require('../models/Service');

    // Create services
    const createdServices = await Service.insertMany(
      services.map(service => ({
        name: service,
        description: `Professional ${service.toLowerCase()} services`,
        category: getServiceCategory(service),
        is_active: true
      }))
    );
    console.log(`Created ${createdServices.length} services`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      ...adminUser,
      password_hash: adminPassword
    });
    console.log('Created admin user:', admin.email);

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await User.create({
      ...testCustomer,
      password_hash: customerPassword
    });
    console.log('Created test customer:', customer.email);

    // Create service providers and their profiles
    const createdProviders = [];
    for (const providerData of serviceProviders) {
      const providerPassword = await bcrypt.hash('provider123', 12);
      
      const provider = await User.create({
        ...providerData,
        password_hash: providerPassword
      });

      // Create provider profile
      await ProviderProfile.create({
        user_id: provider._id.toString(),
        services_offered: providerData.services_offered,
        bio: providerData.bio,
        is_visible: true
      });

      createdProviders.push(provider);
      console.log(`Created provider: ${provider.name}`);
    }

    // Create sample orders (replace placeholder IDs with actual IDs)
    const ordersWithRealIds = sampleOrders.map((order, index) => ({
      ...order,
      user_id: customer._id.toString(),
      provider_id: createdProviders[index % createdProviders.length]._id.toString(),
      service_id: createdServices[index % createdServices.length]._id.toString()
    }));

    const createdOrders = await Order.insertMany(ordersWithRealIds);
    console.log(`Created ${createdOrders.length} sample orders`);

    // Create sample reviews (replace placeholder IDs with actual IDs)
    const reviewsWithRealIds = sampleReviews.map((review, index) => ({
      ...review,
      order_id: createdOrders[index]._id.toString(),
      user_id: customer._id.toString(),
      provider_id: createdProviders[index % createdProviders.length]._id.toString()
    }));

    const createdReviews = await Review.insertMany(reviewsWithRealIds);
    console.log(`Created ${createdReviews.length} sample reviews`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin:', admin.email, '| Password: admin123');
    console.log('Customer:', customer.email, '| Password: customer123');
    console.log('Providers:', serviceProviders.map(p => `${p.email} | Password: provider123`).join('\n'));
    console.log('\n📊 Summary:');
    console.log(`- ${createdServices.length} services`);
    console.log(`- ${createdProviders.length} service providers`);
    console.log(`- ${createdOrders.length} sample orders`);
    console.log(`- ${createdReviews.length} sample reviews`);
    console.log(`- 1 admin user`);
    console.log(`- 1 test customer`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

function getServiceCategory(serviceName) {
  const categories = {
    'Electrical Installation': 'electrical',
    'Plumbing': 'plumbing',
    'Carpentry': 'construction',
    'House Cleaning': 'cleaning',
    'Gardening & Landscaping': 'landscaping',
    'Painting': 'construction',
    'Appliance Repair': 'repair',
    'Moving & Packing': 'moving',
    'Security Installation': 'security',
    'Interior Design': 'design',
    'Roofing': 'construction',
    'HVAC Maintenance': 'maintenance',
    'Flooring Installation': 'construction',
    'Window & Door Repair': 'repair',
    'Furniture Assembly': 'assembly'
  };
  return categories[serviceName] || 'general';
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
