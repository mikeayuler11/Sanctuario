# Cemetery Management System with Digital Mapping

A comprehensive web-based cemetery management system with digital mapping capabilities for **Sanctuario de Santa Rosa de Lima Memorial Park**.

## Features

### 🏠 **Homepage**
- Beautiful responsive design with company branding
- Catchphrase: "COMFORT & ELEGANCE IN AFTERLIFE"
- Detailed plot type information with specifications
- Working login system for clients
- Inquiry submission form
- Company information and contact details

### 👨‍💼 **Admin Dashboard**
- **Dashboard**: Statistics cards, recent activities, upcoming tasks
- **Map**: Placeholder for 3D interactive cemetery map integration
- **Grave Management**: Search, filter, and manage burial records
- **Amortization**: Track plot purchases and rental apartment niches
- **Inquiries**: Manage customer inquiries with reply functionality
- **Maintenance**: Schedule and track maintenance tasks
- **Settings**: System configuration, user management, plot types

### 👥 **User Roles**
- **Admin**: Full system access and management
- **Staff**: Limited access for daily operations
- **Client**: Personal dashboard with plot information

### 🏡 **Plot Types Supported**
1. **Lawn Lots** (2.38 sqm) - 1 fresh body, 4 bones
2. **Garden Lots** (16 sqm) - 2 fresh bodies, 8 bones  
3. **Mini Mausoleum Lot** (21 sqm) - 4 fresh bodies, 8 bones
4. **Mausoleum Lot** (30 sqm) - 2 fresh bodies, 10 bones
5. **Rental Apartment Niche** (0.664 sqm) - 1 fresh body

## Installation Guide

### Prerequisites
- **XAMPP** (Apache, MySQL, PHP 7.4+)
- Web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Download and Setup XAMPP
1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP on your system
3. Start **Apache** and **MySQL** services from XAMPP Control Panel

### Step 2: Setup Project Files
1. Copy the entire `cemetery_management` folder to your XAMPP `htdocs` directory
   - Usually located at: `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac)
2. Your project should be accessible at: `http://localhost/cemetery_management/`

### Step 3: Create Database
1. Open your web browser and go to: `http://localhost/phpmyadmin/`
2. Click "Import" tab
3. Choose the file: `cemetery_management/database/schema.sql`
4. Click "Go" to execute the SQL commands

**Alternative Manual Setup:**
1. Create a new database named `cemetery_management`
2. Copy and paste the contents of `database/schema.sql` into the SQL tab
3. Execute the SQL commands

### Step 4: Verify Installation
1. Navigate to: `http://localhost/cemetery_management/`
2. You should see the beautiful homepage of Sanctuario de Santa Rosa de Lima Memorial Park

### Step 5: Default Login Credentials

#### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **URL**: `http://localhost/cemetery_management/` (login from homepage)

#### Test the System
1. Login as admin to access the full dashboard
2. Explore all modules: Dashboard, Grave Management, Amortization, etc.
3. Create test users from Settings > User Management
4. Submit test inquiries from the homepage

## Project Structure

```
cemetery_management/
├── admin/                      # Admin dashboard pages
│   ├── dashboard.php          # Main admin dashboard
│   ├── grave_management.php   # Burial records management
│   ├── amortization.php       # Payment tracking
│   ├── inquiries.php          # Customer inquiry management
│   ├── maintenance.php        # Maintenance scheduling
│   ├── map.php               # 3D map placeholder
│   └── settings.php          # System configuration
├── client/                    # Client portal pages
│   └── dashboard.php         # Client dashboard
├── assets/
│   └── css/
│       └── style.css         # Main stylesheet
├── config/
│   └── database.php          # Database configuration
├── includes/
│   ├── auth.php              # Authentication system
│   └── logout.php            # Logout functionality
├── database/
│   └── schema.sql            # Database structure and sample data
├── index.php                 # Homepage with login
└── README.md                 # This file
```

## Database Schema

### Key Tables
- **users**: Admin, staff, and client accounts
- **plot_types**: Different types of memorial plots
- **plots**: Individual plot records
- **burials**: Burial/interment records
- **plot_purchases**: Purchase and payment tracking
- **rental_niches**: Rental apartment niche management
- **inquiries**: Customer inquiries and responses
- **maintenance**: Maintenance scheduling and tracking
- **system_settings**: Configurable system settings

## Customization

### Company Information
Update company details through: **Admin Dashboard > Settings > General Settings**

### Plot Types
Manage plot types through: **Admin Dashboard > Settings > Plot Types**

### 3D Map Integration
The map section (`admin/map.php`) is designed as a placeholder for your custom 3D interactive cemetery map. You can integrate your 3D model here.

### Styling
Modify `assets/css/style.css` to customize the appearance and branding.

## Security Features

- Password hashing with PHP's `password_hash()`
- Role-based access control
- SQL injection prevention with prepared statements
- Session management
- Input validation and sanitization

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Microsoft Edge
- ✅ Mobile browsers (responsive design)

## Support

For technical support or customization requests, please contact the development team.

## Company Information

**Sanctuario de Santa Rosa de Lima Memorial Park**
- Address: 2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay
- Phone: 09454785649 / 09684412511
- Email: lrdvc.sanctuario22@gmail.com
- Facebook: Sanctuario de Santa Rosa de Lima

---

**© 2024 Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.**