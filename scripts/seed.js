const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');

// Sample data
const sampleServices = [
  {
    name: 'Electrical Installation',
    description: 'Professional electrical installation services for homes and businesses',
    category: 'electrical',
    is_active: true
  },
  {
    name: 'Plumbing Services',
    description: 'Expert plumbing services including repairs, installation, and maintenance',
    category: 'plumbing',
    is_active: true
  },
  {
    name: 'House Cleaning',
    description: 'Comprehensive house cleaning services for residential properties',
    category: 'cleaning',
    is_active: true
  },
  {
    name: 'Carpentry',
    description: 'Custom carpentry work including furniture making and repairs',
    category: 'carpentry',
    is_active: true
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services for homes and offices',
    category: 'painting',
    is_active: true
  },
  {
    name: 'Landscaping',
    description: 'Garden design, maintenance, and landscaping services',
    category: 'landscaping',
    is_active: true
  },
  {
    name: 'Appliance Repair',
    description: 'Repair services for household appliances and electronics',
    category: 'repair',
    is_active: true
  },
  {
    name: 'Moving Services',
    description: 'Professional moving and relocation services',
    category: 'moving',
    is_active: true
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700000001',
    password: 'password123',
    role: 'customer',
    status: 'active'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+254700000002',
    password: 'password123',
    role: 'customer',
    status: 'active'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+254700000003',
    password: 'password123',
    role: 'provider',
    status: 'active',
    location: {
      type: 'Point',
      coordinates: [36.8219, -1.2921] // Nairobi coordinates
    },
    is_verified: true
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+254700000004',
    password: 'password123',
    role: 'provider',
    status: 'active',
    location: {
      type: 'Point',
      coordinates: [36.8219, -1.2921] // Nairobi coordinates
    },
    is_verified: true,
    gold_member: true
  },
  {
    name: 'Admin User',
    email: 'admin@saka-kazi.com',
    phone: '+254700000005',
    password: 'admin123',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Ops Manager',
    email: 'ops@saka-kazi.com',
    phone: '+254700000006',
    password: 'ops123',
    role: 'ops',
    status: 'active'
  },
  {
    name: 'Finance Manager',
    email: 'finance@saka-kazi.com',
    phone: '+254700000007',
    password: 'finance123',
    role: 'finance',
    status: 'active'
  }
];

const sampleProviderProfiles = [
  {
    user_id: null, // Will be set after user creation
    services_offered: ['Electrical Installation', 'Appliance Repair'],
    is_visible: true,
    bio: 'Experienced electrician with over 10 years in the industry. Specializing in residential and commercial electrical work.',
    certification: 'https://example.com/cert1.pdf'
  },
  {
    user_id: null, // Will be set after user creation
    services_offered: ['House Cleaning', 'Landscaping'],
    is_visible: true,
    bio: 'Professional cleaning and landscaping services. We take pride in making your space beautiful and clean.',
    certification: 'https://example.com/cert2.pdf'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await ProviderProfile.deleteMany({});
    console.log('Cleared existing data');

    // Create services
    const createdServices = await Service.insertMany(sampleServices);
    console.log(`Created ${createdServices.length} services`);

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password_hash: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create provider profiles
    const providers = createdUsers.filter(user => user.role === 'provider');
    for (let i = 0; i < providers.length; i++) {
      const providerProfile = new ProviderProfile({
        ...sampleProviderProfiles[i],
        user_id: providers[i]._id
      });
      await providerProfile.save();
    }
    console.log(`Created ${providers.length} provider profiles`);

    // Create sample orders (optional)
    // This would require more complex logic and relationships

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample accounts created:');
    console.log('Customer: john@example.com / password123');
    console.log('Provider: mike@example.com / password123');
    console.log('Admin: admin@saka-kazi.com / admin123');
    console.log('Ops: ops@saka-kazi.com / ops123');
    console.log('Finance: finance@saka-kazi.com / finance123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
