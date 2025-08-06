# Sanctuario de Santa Rosa de Lima Memorial Park Management System

A comprehensive web-based cemetery management system with digital mapping capabilities, built with React and modern web technologies.

## Features

### 🏠 Homepage & Authentication
- Beautiful landing page with login functionality
- Role-based authentication (Admin/Staff)
- Secure session management
- Demo credentials provided for testing

### 📊 Dashboard
- Overview statistics and KPIs
- Recent activities timeline
- Upcoming maintenance schedule
- Quick action buttons

### 🗺️ Interactive Digital Map
- 3D cemetery visualization using Three.js
- GLB file support for custom 3D models
- Interactive plot selection and information
- Full-screen map view
- Search and filter by sections
- Real-time plot status visualization

### 💼 Grave Management
- Complete deceased person records
- Plot assignment and tracking
- Search and filter functionality
- CRUD operations for grave records
- Table view with pagination
- Export/import capabilities

### 💰 Amortization System
- Payment tracking for rental niches
- Installment plan management
- Payment progress visualization
- Overdue payment alerts
- Multiple payment methods support
- Financial reporting

### 💬 Inquiries Management
- Client inquiry tracking
- Categorized inquiry types
- Priority-based handling
- Response management
- Status tracking (Pending, In Progress, Resolved)

### 🔧 Maintenance System
- Maintenance request management
- Work order scheduling
- Cost tracking and estimation
- Assignment to maintenance staff
- History and upcoming requests
- Priority-based organization

### ⚙️ Settings
- User profile management
- System configuration
- Notification preferences
- Security settings
- Data import/export
- Theme customization

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and visualization
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Lucide React** - Modern icon library

### Additional Libraries
- **axios** - HTTP client
- **date-fns** - Date manipulation
- **recharts** - Charts and data visualization
- **react-table** - Table management
- **react-modal** - Modal components
- **react-toastify** - Notifications

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cemetery-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Demo Credentials

### Admin Account
- **Username:** admin
- **Password:** admin
- **Access:** Full system access

### Staff Account
- **Username:** staff
- **Password:** staff
- **Access:** Limited system access

## File Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.js        # Main layout with sidebar
│   └── Map3D.js         # 3D mapping component
├── pages/               # Page components
│   ├── Login.js         # Authentication page
│   ├── Dashboard.js     # Main dashboard
│   ├── MapPage.js       # Interactive map
│   ├── GraveManagement.js # Grave records
│   ├── Amortization.js  # Payment management
│   ├── Inquiries.js     # Client inquiries
│   ├── Maintenance.js   # Maintenance requests
│   └── Settings.js      # System settings
├── context/             # React context providers
│   └── AuthContext.js   # Authentication state
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── assets/              # Static assets
├── App.js               # Main application component
└── index.js             # Application entry point
```

## Key Features Explained

### 3D Digital Mapping
The system includes a sophisticated 3D mapping component that can:
- Load custom GLB 3D models of the cemetery
- Display interactive plot information
- Support camera controls (zoom, pan, rotate)
- Show real-time plot availability
- Provide detailed plot information on click

### GLB File Support
To use your own 3D cemetery model:
1. Export your 3D model as a GLB file
2. Use the "Upload GLB Model" feature in the map section
3. The system will automatically load and display your custom model

### Responsive Design
The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes

## Customization

### Colors & Theming
The system uses Tailwind CSS with custom color schemes defined in `tailwind.config.js`. You can easily customize:
- Primary colors
- Secondary colors
- Component styling
- Layout spacing

### Adding New Features
The modular structure makes it easy to add new features:
1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update routing in `App.js`
4. Add navigation items in `Layout.js`

## API Integration

The system is designed to work with RESTful APIs. To integrate with your backend:

1. Update API endpoints in utility functions
2. Replace mock data with actual API calls
3. Implement proper error handling
4. Add loading states for better UX

## Security Features

- Role-based access control
- Session management
- Protected routes
- Input validation
- Secure authentication flow

## Performance Optimizations

- Code splitting with React.lazy
- Memoized components
- Efficient state management
- Optimized 3D rendering
- Pagination for large datasets

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions about the cemetery management system, please contact the development team or refer to the documentation.

## Future Enhancements

- Mobile app version
- Advanced reporting features
- Integration with payment gateways
- Email notification system
- Advanced 3D modeling features
- Multi-language support
- API documentation
- Automated backups

---

**Sanctuario de Santa Rosa de Lima Memorial Park Management System** - Built with ❤️ for efficient cemetery management.