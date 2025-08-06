-- Cemetery Management System Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS cemetery_management;
USE cemetery_management;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'staff', 'client') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Plot types table
CREATE TABLE plot_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    capacity_fresh_bodies INT NOT NULL,
    capacity_bones INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Graves/Plots table
CREATE TABLE graves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_number VARCHAR(50) UNIQUE NOT NULL,
    plot_type_id INT NOT NULL,
    owner_id INT NULL,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    location_x DECIMAL(10,6),
    location_y DECIMAL(10,6),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_type_id) REFERENCES plot_types(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Burials table for tracking interments
CREATE TABLE burials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grave_id INT NOT NULL,
    deceased_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_death DATE NOT NULL,
    date_of_interment DATE NOT NULL,
    burial_type ENUM('fresh_body', 'bones') NOT NULL,
    relationship_to_owner VARCHAR(50),
    notes TEXT,
    created_by INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grave_id) REFERENCES graves(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Amortization table for payment tracking
CREATE TABLE amortization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grave_id INT NOT NULL,
    client_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    mode_of_payment ENUM('spot_cash', 'straight_payment', 'downpayment') NOT NULL,
    terms INT NOT NULL, -- in years
    monthly_payment DECIMAL(12,2) NOT NULL,
    first_payment_date DATE NOT NULL,
    last_payment_date DATE NOT NULL,
    outstanding_balance DECIMAL(12,2) NOT NULL,
    status ENUM('active', 'completed', 'overdue', 'cancelled') DEFAULT 'active',
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grave_id) REFERENCES graves(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Rental apartment niches table
CREATE TABLE rental_niches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    niche_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    contract_start DATE NOT NULL,
    contract_end DATE NOT NULL,
    rental_amount DECIMAL(12,2) NOT NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Inquiries table
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    reply TEXT NULL,
    replied_by INT NULL,
    date_replied TIMESTAMP NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id)
);

-- Maintenance table
CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grave_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    performed_by VARCHAR(100) NOT NULL,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_by INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grave_id) REFERENCES graves(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default plot types
INSERT INTO plot_types (name, area, capacity_fresh_bodies, capacity_bones, price, description) VALUES
('Lawn Lots', 2.38, 1, 4, 50000.00, 'LOT AREA: 2.38 SQUARE METERS, UNDERGROUND INTERMENT, FLAT ON GROUND TOMBSTONE'),
('Garden Lots', 16.00, 2, 8, 150000.00, 'LOT AREA: 16 SQUARE METERS, UNDERGROUND INTERMENT, FLAT ON GROUND TOMBSTONE'),
('Mini Mausoleum Lot', 21.00, 4, 8, 250000.00, 'LOT AREA: 21 SQUARE METERS, UNDERGROUND STRUCTURE, UNIFORM EXTERIOR DESIGN'),
('Mausoleum Lot', 30.00, 2, 10, 350000.00, 'LOT AREA: 30 SQUARE METERS, OPTIONAL INTERMENT, UNIFORM EXTERIOR DESIGN'),
('Rental Apartment Niche', 0.664, 1, 0, 25000.00, 'AREA: 0.664 SQUARE METERS, ABOVE GROUND INTERMENT, ONE TIME PAYMENT');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, user_type, first_name, last_name, phone, address) VALUES
('admin', 'admin@sanctuario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System', 'Administrator', '09454785649', '2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'Sanctuario de Santa Rosa de Lima Memorial Park', 'Website name'),
('site_tagline', 'COMFORT & ELEGANCE IN AFTERLIFE', 'Website tagline'),
('company_address', '2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay', 'Company address'),
('company_phone', '09454785649 / 09684412511', 'Company phone numbers'),
('company_email', 'lrdvc.sanctuario22@gmail.com', 'Company email'),
('facebook_page', 'Sanctuario de Santa Rosa de Lima', 'Facebook page name');