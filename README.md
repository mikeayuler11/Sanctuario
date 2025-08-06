# Sanctuario de Santa Rosa de Lima Memorial Park - Cemetery Management System

A comprehensive web-based cemetery management system with digital mapping capabilities, designed for modern cemetery operations with a beautiful 2025 UI and smooth animations.

## 🌟 Features

### 🏠 **Beautiful Homepage**
- Modern 2025 design with CSS animations
- Client registration and login system
- Memorial lot showcase with detailed specifications
- Contact information and inquiry forms
- Responsive design for all devices

### 👨‍💼 **Admin Dashboard**
- Complete cemetery management control
- Interactive dashboard with statistics and charts
- Full access to all system features
- User management and system settings

### 👨‍💼 **Staff Dashboard**  
- Limited access management interface
- Essential cemetery operations
- Burial and maintenance management
- Inquiry response system

### 👤 **Client Portal**
- Personal dashboard with owned plots
- Payment status and amortization tracking
- Inquiry submission system
- Profile management

### 🗺️ **Digital Mapping System**
- 3D interactive cemetery map (ready for integration)
- Plot location tracking
- Status visualization (available, occupied, maintenance)
- Search and filter capabilities

### 📊 **Management Features**
- **Grave Management**: Plot creation, burial records, search & filters
- **Amortization System**: Payment plans, rental niches, payment tracking
- **Inquiry Management**: Client communication, response system
- **Maintenance Scheduling**: Task management, history tracking
- **Comprehensive Reporting**: Statistics, charts, and analytics

## 🏗️ **System Architecture**

### **User Roles**
1. **Admin**: Full system access and management
2. **Staff**: Limited operational access
3. **Client**: Personal plot and payment management

### **Plot Types Supported**
- **Lawn Lots**: 2.38 sq.m, 1 fresh body + 4 bones
- **Garden Lots**: 16 sq.m, 2 fresh bodies + 8 bones  
- **Mini Mausoleum Lot**: 21 sq.m, 4 fresh bodies + 8 bones
- **Mausoleum Lot**: 30 sq.m, 2 fresh bodies + 10 bones
- **Rental Apartment Niche**: 0.664 sq.m, 1 fresh body

## 🚀 **Installation Guide**

### **Prerequisites**
- XAMPP (Apache, MySQL, PHP 7.4+)
- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor (optional, for customization)

### **Step 1: Setup XAMPP**
1. Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Start Apache and MySQL services from XAMPP Control Panel

### **Step 2: Database Setup**
1. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
2. Import the database schema:
   - Click "Import" tab
   - Choose file: `database/cemetery_management.sql`
   - Click "Go" to execute

### **Step 3: Project Installation**
1. Copy the entire project folder to `C:\xampp\htdocs\cemetery-management\`
2. Ensure the folder structure looks like:
   ```
   htdocs/cemetery-management/
   ├── assets/
   ├── config/
   ├── includes/
   ├── pages/
   ├── database/
   └── index.php
   ```

### **Step 4: Configuration**
1. Open `config/database.php`
2. Verify database settings:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'cemetery_management');
   ```

### **Step 5: Access the System**
1. Open your web browser
2. Navigate to: `http://localhost/cemetery-management/`
3. The homepage should load with the beautiful interface

## 🔐 **Default Login Credentials**

### **Admin Account**
- **Username**: `admin`
- **Email**: `admin@sanctuario.com`
- **Password**: `admin123`

## 📱 **System Usage**

### **For Clients**
1. **Registration**: Create account from homepage
2. **Login**: Access personal dashboard
3. **View Plots**: See owned memorial plots
4. **Check Payments**: Monitor amortization status
5. **Send Inquiries**: Contact management team

### **For Staff**
1. **Login**: Use staff credentials
2. **Manage Burials**: Add new burial records
3. **Handle Inquiries**: Respond to client questions
4. **Schedule Maintenance**: Plan plot maintenance
5. **View Reports**: Access operational statistics

### **For Administrators**
1. **Full Management**: Complete system control
2. **User Management**: Create staff and client accounts
3. **Financial Tracking**: Monitor all payments
4. **System Settings**: Configure system parameters
5. **Advanced Reports**: Comprehensive analytics

## 🎨 **Modern 2025 UI Features**

- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: CSS3 animations and transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Modern Typography**: Clean, readable fonts
- **Card-based Layout**: Organized information presentation
- **Color-coded Status**: Visual status indicators

## 🗺️ **3D Map Integration**

The system includes a placeholder for 3D cemetery mapping:
- **Location**: `pages/admin/map.php` and `pages/client/map.php`
- **Ready for Integration**: With Three.js, Babylon.js, or custom 3D libraries
- **Features Planned**: Interactive plot selection, 3D visualization, real-time updates

## 📊 **Database Schema**

### **Core Tables**
- `users`: System users (admin, staff, clients)
- `plot_types`: Memorial plot configurations
- `graves`: Cemetery plot records
- `burials`: Burial/interment records
- `amortization`: Payment plan tracking
- `rental_niches`: Rental apartment management
- `inquiries`: Client communication
- `maintenance`: Plot maintenance scheduling
- `activity_logs`: System activity tracking
- `settings`: System configuration

## 🔧 **Customization**

### **Styling**
- Modify `assets/css/style.css` for visual changes
- CSS variables available for easy color scheme updates
- Responsive breakpoints pre-configured

### **Functionality**
- Add new features in respective page directories
- Extend database schema as needed
- Implement additional user roles

### **3D Map Integration**
- Replace placeholder in map pages
- Integrate with preferred 3D library
- Connect with plot database for real-time updates

## 📞 **Support & Contact**

**Sanctuario de Santa Rosa de Lima Memorial Park**
- **Address**: 2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay
- **Phone**: 09454785649 / 09684412511
- **Email**: lrdvc.sanctuario22@gmail.com
- **Facebook**: Sanctuario de Santa Rosa de Lima

## 🏆 **System Highlights**

✅ **Complete Cemetery Management**  
✅ **Modern 2025 UI Design**  
✅ **Multi-user Role System**  
✅ **Payment Plan Management**  
✅ **Digital Mapping Ready**  
✅ **Responsive Mobile Design**  
✅ **Secure Authentication**  
✅ **Comprehensive Reporting**  
✅ **Client Portal System**  
✅ **Maintenance Scheduling**

## 📄 **License**

This system is developed for Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.

---

**"COMFORT & ELEGANCE IN AFTERLIFE"**

*Providing peaceful, dignified resting places with modern management technology.*