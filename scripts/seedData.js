const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Grave = require('../models/Grave');
const Inquiry = require('../models/Inquiry');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sanctuario_cemetery');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Grave.deleteMany({});
    await Inquiry.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Administrator',
      lastName: 'System',
      email: 'admin@sanctuario.com',
      password: 'admin123',
      role: 'admin',
      phone: '+63 (02) 8123-4567',
      address: {
        street: '123 Memorial Drive',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines'
      }
    });

    // Create staff user
    const staffUser = await User.create({
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'staff@sanctuario.com',
      password: 'staff123',
      role: 'staff',
      phone: '+63 (02) 8123-4568',
      address: {
        street: '456 Staff Avenue',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1101',
        country: 'Philippines'
      }
    });

    // Create client user
    const clientUser = await User.create({
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'client@sanctuario.com',
      password: 'client123',
      role: 'client',
      phone: '+63 (02) 8123-4569',
      address: {
        street: '789 Client Street',
        city: 'Manila',
        state: 'Metro Manila',
        zipCode: '1000',
        country: 'Philippines'
      }
    });

    console.log('Created users:');
    console.log('Admin - admin@sanctuario.com / admin123');
    console.log('Staff - staff@sanctuario.com / staff123');
    console.log('Client - client@sanctuario.com / client123');

    // Create sample graves
    const sampleGraves = [
      {
        plotNumber: 'A-001',
        section: 'Garden of Peace',
        block: 'A',
        row: '1',
        graveType: 'single',
        status: 'occupied',
        price: 15000,
        owner: clientUser._id,
        coordinates: { latitude: 14.6760, longitude: 121.0437 },
        dimensions: { length: 2.5, width: 1.2 },
        deceased: [{
          firstName: 'Rosa',
          lastName: 'Dela Cruz',
          dateOfBirth: new Date('1950-05-15'),
          dateOfDeath: new Date('2020-12-25'),
          relationToOwner: 'Mother'
        }],
        amortization: {
          totalAmount: 15000,
          paidAmount: 12000,
          remainingAmount: 3000
        }
      },
      {
        plotNumber: 'B-045',
        section: 'Memorial Gardens',
        block: 'B',
        row: '8',
        graveType: 'double',
        status: 'available',
        price: 25000,
        coordinates: { latitude: 14.6761, longitude: 121.0438 },
        dimensions: { length: 3.0, width: 2.0 }
      }
    ];

    const graves = await Grave.insertMany(sampleGraves);
    console.log(`Created ${graves.length} sample graves`);

    // Create sample inquiry
    const sampleInquiry = await Inquiry.create({
      client: clientUser._id,
      subject: 'Memorial service scheduling',
      message: 'I would like to schedule a memorial service for my mother. Please let me know the available dates and procedures.',
      category: 'memorial-service',
      priority: 'medium',
      relatedGrave: graves[0]._id
    });

    console.log('Created sample inquiry');

    console.log('Seed data created successfully!');
    console.log('\nTo test the application:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Start the client: cd client && npm start');
    console.log('3. Visit http://localhost:3000');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedData();