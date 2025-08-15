-- Sanctuario de Santa Rosa de Lima Memorial Park Database Schema
-- Created for the memorial park management system

-- Create database
CREATE DATABASE IF NOT EXISTS sanctuario_db;
USE sanctuario_db;

-- Users table for authentication and role management
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'client') NOT NULL DEFAULT 'client',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Plot types table
CREATE TABLE plot_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    area DECIMAL(10,3) NOT NULL,
    interment_type ENUM('underground', 'above_ground', 'optional') NOT NULL,
    tombstone_type VARCHAR(100),
    capacity_fresh INT DEFAULT 0,
    capacity_bones INT DEFAULT 0,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Plots table
CREATE TABLE plots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_number VARCHAR(50) UNIQUE NOT NULL,
    plot_type_id INT NOT NULL,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    location_x DECIMAL(10,6),
    location_y DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_type_id) REFERENCES plot_types(id)
);

-- Graves table for interment records
CREATE TABLE graves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_id INT NOT NULL,
    client_id INT NOT NULL,
    deceased_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    date_of_death DATE,
    date_of_interment DATE NOT NULL,
    interment_type ENUM('fresh_body', 'bones') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Amortization table for payment tracking
CREATE TABLE amortizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_id INT NOT NULL,
    client_id INT NOT NULL,
    mode_of_payment ENUM('spot_cash', 'straight_payment', 'downpayment') NOT NULL,
    terms INT NOT NULL, -- in years
    monthly_amortization DECIMAL(12,2) NOT NULL,
    first_payment_date DATE NOT NULL,
    last_payment_date DATE,
    outstanding_balance DECIMAL(12,2) DEFAULT 0,
    status ENUM('active', 'completed', 'overdue') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Payment history table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amortization_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'check', 'online') NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (amortization_id) REFERENCES amortizations(id)
);

-- Rental niches table
CREATE TABLE rental_niches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    niche_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Inquiries table
CREATE TABLE inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    client_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Maintenance table
CREATE TABLE maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    performed_by INT NOT NULL,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    cost DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default plot types
INSERT INTO plot_types (name, area, interment_type, tombstone_type, capacity_fresh, capacity_bones, price, description) VALUES
('Lawn Lots', 2.38, 'underground', 'Flat on Ground Tombstone', 1, 4, 150000.00, 'Standard lawn burial lots with flat ground tombstones'),
('Garden Lots', 16.00, 'underground', 'Flat on Ground Tombstone', 2, 8, 250000.00, 'Spacious garden lots for multiple interments'),
('Mini Mausoleum Lot', 21.00, 'underground', 'Uniform Exterior Design', 4, 8, 350000.00, 'Underground structure with uniform exterior design'),
('Mausoleum Lot', 30.00, 'optional', 'Uniform Exterior Design', 2, 10, 500000.00, 'Large mausoleum with optional interment types'),
('Rental Apartment Niche', 0.664, 'above_ground', 'One-Time Payment', 1, 0, 75000.00, 'Above ground interment with one-time payment');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, first_name, last_name, phone, address) VALUES
('admin', 'admin@sanctuario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System', 'Administrator', '09454785649', '2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Sanctuario de Santa Rosa de Lima Memorial Park', 'Website name'),
('site_tagline', 'COMFORT & ELEGANCE IN AFTERLIFE', 'Website tagline'),
('contact_address', '2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay', 'Contact address'),
('contact_phone', '09454785649 / 09684412511', 'Contact phone numbers'),
('contact_email', 'lrdvc.sanctuario22@gmail.com', 'Contact email'),
('facebook_page', 'Sanctuario de Santa Rosa de Lima', 'Facebook page name'),
('mission', 'To provide a place of hope, healing, and peace through dignified memorial spaces regularly maintained with care.', 'Company mission'),
('vision', 'To be Bacacay\'s most prestigious memorial park, offering serene, spacious, and well-maintained resting places for the departed.', 'Company vision');