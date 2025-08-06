import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  Users, 
  Shield, 
  Leaf,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Digital Mapping",
      description: "Advanced GPS mapping system for easy grave location and navigation"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Memorial Services",
      description: "Comprehensive memorial and burial services with dignity and respect"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Management",
      description: "Professional cemetery management with 24/7 security monitoring"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Peaceful Environment",
      description: "Beautifully landscaped grounds providing a serene resting place"
    }
  ];

  const stats = [
    { number: "50+", label: "Years of Service" },
    { number: "10,000+", label: "Families Served" },
    { number: "24/7", label: "Security" },
    { number: "100%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-gradient">
                Sanctuario de Santa Rosa de Lima
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-cemetery-600 transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-cemetery-600 transition-colors">
                Services
              </a>
              <a href="#contact" className="text-gray-700 hover:text-cemetery-600 transition-colors">
                Contact
              </a>
              {isAuthenticated() ? (
                <Link 
                  to={user?.role === 'client' ? '/client' : '/dashboard'}
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-cemetery-600"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-cemetery-600">
                About
              </a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-cemetery-600">
                Services
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-cemetery-600">
                Contact
              </a>
              {isAuthenticated() ? (
                <Link 
                  to={user?.role === 'client' ? '/client' : '/dashboard'}
                  className="block px-3 py-2 text-cemetery-600 font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-cemetery-600 font-medium">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6"
            >
              Memorial Park
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Honoring memories with dignity and care. A peaceful sanctuary where loved ones rest in eternal peace.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/login" className="btn-primary text-lg px-8 py-3">
                Access Portal
              </Link>
              <a href="#services" className="btn-secondary text-lg px-8 py-3">
                Our Services
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-cemetery-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive cemetery management and memorial services designed to honor your loved ones
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-cemetery-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                About Sanctuario de Santa Rosa de Lima
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Established with a mission to provide dignified and respectful memorial services, 
                our memorial park serves as a peaceful sanctuary for families to honor and remember 
                their loved ones.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With over 50 years of service, we have helped thousands of families through their 
                most difficult times, providing comfort, support, and a beautiful final resting place.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-cemetery-100 to-memorial-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌹</div>
                  <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
                    A Place of Peace
                  </h3>
                  <p className="text-gray-600">
                    Where memories live forever and love never fades
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600">
              We're here to help you during this difficult time
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card text-center"
            >
              <MapPin className="w-8 h-8 text-cemetery-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                123 Memorial Drive<br />
                Santa Rosa, Lima<br />
                Philippines
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card text-center"
            >
              <Phone className="w-8 h-8 text-cemetery-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">
                +63 2 1234 5678<br />
                +63 912 345 6789
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card text-center"
            >
              <Clock className="w-8 h-8 text-cemetery-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">
                Monday - Sunday<br />
                6:00 AM - 6:00 PM<br />
                24/7 Emergency Service
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-4">
                Sanctuario de Santa Rosa de Lima
              </h3>
              <p className="text-gray-300 mb-4">
                Honoring memories with dignity and care since 1970
              </p>
              <div className="flex space-x-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <Phone className="w-5 h-5 text-gray-400" />
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Burial Services</li>
                <li>Memorial Services</li>
                <li>Grave Maintenance</li>
                <li>Digital Mapping</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;