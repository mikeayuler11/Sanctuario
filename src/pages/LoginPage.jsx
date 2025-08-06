import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  User, 
  Shield, 
  Users, 
  ArrowLeft,
  Lock,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const userTypes = [
    {
      id: 'client',
      title: 'Client',
      description: 'Access your family records and grave information',
      icon: <User className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Cemetery management and operations',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Full system access and management',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const success = login(data.email, data.password, selectedUserType);
      
      if (success) {
        // Redirect based on user type
        if (selectedUserType === 'client') {
          navigate('/client');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoCredentials = () => {
    const credentials = {
      client: { email: 'client@example.com', password: 'password123' },
      staff: { email: 'staff@sanctuario.com', password: 'password123' },
      admin: { email: 'admin@sanctuario.com', password: 'password123' }
    };
    return credentials[selectedUserType];
  };

  const fillDemoCredentials = () => {
    const creds = getDemoCredentials();
    reset({
      email: creds.email,
      password: creds.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-memorial flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-cemetery-600 hover:text-cemetery-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your account
          </p>
        </div>

        {/* User Type Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select User Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedUserType(type.id)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedUserType === type.id
                    ? `border-cemetery-500 bg-cemetery-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`text-cemetery-600 mb-2 flex justify-center ${
                  selectedUserType === type.id ? 'text-cemetery-700' : 'text-gray-500'
                }`}>
                  {type.icon}
                </div>
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {type.title}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Demo Credentials Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-sm text-cemetery-600 hover:text-cemetery-700 underline"
            >
              Fill Demo Credentials
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> {getDemoCredentials().email}</p>
              <p><strong>Password:</strong> {getDemoCredentials().password}</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#contact" className="font-medium text-cemetery-600 hover:text-cemetery-700">
              Contact support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;