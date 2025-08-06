# Sanctuario de Santa Rosa de Lima Memorial Park - Cemetery Management System

A modern, responsive web-based cemetery management system with digital mapping capabilities, built with React and Tailwind CSS.

## 🌟 Features

### Public Features
- **Beautiful Homepage**: Modern, responsive design showcasing the memorial park
- **Service Information**: Comprehensive details about burial and memorial services
- **Contact Information**: Easy access to location, phone, and hours

### User Management System
- **Three User Types**: Client, Staff, and Administrator
- **Role-Based Access**: Different features and permissions for each user type
- **Secure Authentication**: Protected routes and user sessions

### Client Portal
- **Family Records**: View family burial records and grave information
- **Quick Actions**: Easy access to common client tasks
- **Recent Activities**: Track maintenance and visit history

### Management System (Staff & Admin)
- **Dashboard**: Comprehensive overview with statistics and charts
- **Digital Mapping**: Interactive cemetery map (placeholder for future implementation)
- **Grave Management**: Complete CRUD operations for burial plots
- **Amortization**: Payment schedules and financial management
- **Inquiries**: Client inquiry management and support
- **Maintenance**: Task scheduling and maintenance tracking
- **Settings**: System configuration and user preferences

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sanctuario-cemetery-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

### Client Access
- **Email**: `client@example.com`
- **Password**: `password123`
- **Features**: View family records, grave locations, request maintenance

### Staff Access
- **Email**: `staff@sanctuario.com`
- **Password**: `password123`
- **Features**: Full management system access

### Administrator Access
- **Email**: `admin@sanctuario.com`
- **Password**: `password123`
- **Features**: Complete system access with all permissions

## 🏗️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom cemetery theme
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth)
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── management/     # Management system pages
│   └── ...            # Other pages
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Cemetery blue tones
- **Secondary**: Memorial gold accents
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Serif**: Playfair Display for headings
- **Sans**: Inter for body text

### Components
- **Cards**: Consistent card design with shadows
- **Buttons**: Primary and secondary button styles
- **Forms**: Styled form inputs with focus states
- **Tables**: Responsive data tables

## 🔧 Customization

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.jsx`
4. Add navigation items in `src/layouts/ManagementLayout.jsx`

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for custom styles
- Use the predefined CSS classes for consistency

## 📱 Responsive Design

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Role-based access control
- Protected routes
- Session management
- Form validation
- Secure authentication flow

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📊 Future Enhancements

- **Real Digital Mapping**: Integration with mapping services
- **Payment Gateway**: Online payment processing
- **Mobile App**: Native mobile application
- **API Integration**: Backend API development
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-language Support**: Internationalization
- **Document Management**: File upload and storage
- **SMS Notifications**: Text message alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries:
- **Email**: support@sanctuario.com
- **Phone**: +63 2 1234 5678
- **Address**: 123 Memorial Drive, Santa Rosa, Lima, Philippines

---

**Sanctuario de Santa Rosa de Lima Memorial Park** - Honoring memories with dignity and care since 1970.