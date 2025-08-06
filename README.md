# Sanctuario de Santa Rosa de Lima Memorial Park - Cemetery Management System

A comprehensive digital cemetery management system with modern web technologies, featuring role-based access control for clients, staff, and administrators.

## 🌟 Features

### For Clients
- **Beautiful Homepage**: Modern, responsive design showcasing memorial park services
- **Client Registration & Login**: Secure account creation and authentication
- **Personal Dashboard**: Overview of graves, payments, and inquiries
- **Grave Management**: View owned plots with detailed information
- **Inquiry System**: Submit and track support requests
- **Profile Management**: Update personal information and preferences

### For Staff & Administrators
- **Management Portal**: Comprehensive dashboard with sidebar navigation
- **Digital Map System**: Interactive cemetery mapping (placeholder for future development)
- **Grave Management**: Complete plot administration and tracking
- **Amortization System**: Payment and installment management
- **Inquiry Management**: Handle client requests and communications
- **Maintenance Scheduling**: Track and manage cemetery maintenance tasks
- **User Management**: Administrative tools for user accounts
- **Settings Panel**: System configuration options

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting
- **Models**: User, Grave, Inquiry with comprehensive schemas
- **API Routes**: RESTful endpoints for all system functions

### Frontend (React + TypeScript)
- **UI Framework**: Material-UI (MUI) with custom theming
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context for authentication
- **Routing**: React Router with protected routes
- **Responsive Design**: Mobile-first approach with beautiful animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd sanctuario-cemetery-management
npm install
cd client && npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sanctuario_cemetery
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup
Start MongoDB and run the seed script:
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with test data
node scripts/seedData.js
```

### 4. Start the Application
```bash
# Terminal 1: Start the backend server
npm run dev

# Terminal 2: Start the React frontend
npm run client
```

### 5. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 👥 Test Accounts

After running the seed script, you can use these test accounts:

### Administrator
- **Email**: admin@sanctuario.com
- **Password**: admin123
- **Access**: Full system administration

### Staff Member
- **Email**: staff@sanctuario.com
- **Password**: staff123
- **Access**: Operational management tools

### Client
- **Email**: client@sanctuario.com
- **Password**: client123
- **Access**: Personal dashboard and services

## 🔐 Security Features

- **Role-Based Access Control**: Separate portals for clients, staff, and administrators
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Client-side route protection based on user roles
- **Input Validation**: Comprehensive server and client-side validation
- **Rate Limiting**: API protection against abuse
- **Password Hashing**: Bcrypt with salt rounds for secure password storage

## 🎨 Design Features

- **Modern UI**: Beautiful, clean interface with professional styling
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Custom Theme**: Carefully crafted color palette and typography
- **Smooth Animations**: Hover effects and transitions for enhanced UX
- **Accessibility**: Following web accessibility guidelines

## 📁 Project Structure

```
sanctuario-cemetery-management/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── contexts/                # React contexts (Auth)
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── client/             # Client dashboard pages
│   │   │   └── management/         # Management dashboard pages
│   │   └── App.tsx                 # Main App component
├── models/                          # Database models
│   ├── User.js                     # User model with roles
│   ├── Grave.js                    # Grave/plot model
│   └── Inquiry.js                  # Inquiry model
├── routes/                          # API routes
│   ├── auth.js                     # Authentication routes
│   ├── users.js                    # User management
│   ├── graves.js                   # Grave management
│   ├── inquiries.js                # Inquiry system
│   └── maintenance.js              # Maintenance management
├── middleware/                      # Express middleware
│   └── auth.js                     # Authentication middleware
├── scripts/                         # Utility scripts
│   └── seedData.js                 # Database seeding
├── server.js                        # Express server
├── package.json                     # Backend dependencies
└── README.md                        # This file
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node scripts/seedData.js` - Seed database with test data

### Frontend
- `npm run client` - Start React development server
- `npm run build` - Build for production
- `npm run install-client` - Install client dependencies

## 🚧 Future Enhancements

### Planned Features
- **Interactive Digital Map**: GPS-integrated cemetery mapping
- **Payment Gateway**: Online payment processing
- **Mobile App**: Native mobile applications
- **QR Code Integration**: QR codes for grave identification
- **Advanced Reporting**: Comprehensive analytics and reports
- **Email Notifications**: Automated email communications
- **Document Management**: Digital document storage and retrieval

### Technical Improvements
- **Testing Suite**: Unit and integration tests
- **Docker Support**: Containerization for easy deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Optimization**: Caching and optimization
- **Internationalization**: Multi-language support

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Client registration
- `POST /api/auth/login/client` - Client login
- `POST /api/auth/login/management` - Staff/Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Management Endpoints
- `GET /api/graves` - Get graves (filtered by role)
- `POST /api/graves` - Create new grave (Staff/Admin)
- `GET /api/inquiries` - Get inquiries (filtered by role)
- `POST /api/inquiries` - Create inquiry
- `GET /api/users` - Get users (Admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Email**: info@sanctuario-memorial.com
- **Phone**: +63 (02) 8123-4567
- **Address**: 123 Memorial Drive, Quezon City, Metro Manila

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2025 Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.