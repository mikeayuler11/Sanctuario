-- Cemetery Management System Database Schema
CREATE DATABASE IF NOT EXISTS cemetery_management;
USE cemetery_management;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    user_type ENUM('admin', 'staff', 'client') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Plot types table
CREATE TABLE plot_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area_sqm DECIMAL(8,2) NOT NULL,
    fresh_body_capacity INT NOT NULL,
    bones_capacity INT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plots table
CREATE TABLE plots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_number VARCHAR(20) UNIQUE NOT NULL,
    plot_type_id INT NOT NULL,
    status ENUM('available', 'sold', 'reserved', 'maintenance') DEFAULT 'available',
    location_x DECIMAL(10,6),
    location_y DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_type_id) REFERENCES plot_types(id)
);

-- Burials table
CREATE TABLE burials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_id INT NOT NULL,
    deceased_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_death DATE NOT NULL,
    date_of_interment DATE NOT NULL,
    burial_type ENUM('fresh_body', 'bones') NOT NULL,
    relationship_to_owner VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id)
);

-- Plot purchases table
CREATE TABLE plot_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_id INT NOT NULL,
    client_id INT NOT NULL,
    purchase_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('spot_cash', 'straight_payment', 'downpayment') NOT NULL,
    payment_terms INT, -- in years
    monthly_amortization DECIMAL(10,2),
    first_payment_date DATE,
    last_payment_date DATE,
    outstanding_balance DECIMAL(10,2) DEFAULT 0,
    status ENUM('active', 'completed', 'defaulted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Rental niches table
CREATE TABLE rental_niches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    niche_number VARCHAR(20) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    contract_start DATE NOT NULL,
    contract_end DATE NOT NULL,
    rental_fee DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    reply TEXT,
    replied_by INT,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id)
);

-- Maintenance table
CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    performed_by VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots(id)
);

-- Payment history table
CREATE TABLE payment_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_id) REFERENCES plot_purchases(id)
);

-- System settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default plot types
INSERT INTO plot_types (name, area_sqm, fresh_body_capacity, bones_capacity, description, price) VALUES
('Lawn Lots', 2.38, 1, 4, 'Underground interment with flat on ground tombstone', 50000.00),
('Garden Lots', 16.00, 2, 8, 'Underground interment with flat on ground tombstone', 150000.00),
('Mini Mausoleum Lot', 21.00, 4, 8, 'Underground structure with uniform exterior design', 250000.00),
('Mausoleum Lot', 30.00, 2, 10, 'Optional interment with uniform exterior design', 350000.00),
('Rental Apartment Niche', 0.664, 1, 0, 'Above ground interment, one time payment', 75000.00);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, user_type) VALUES
('admin', 'admin@sanctuario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');

-- Insert sample plots
INSERT INTO plots (plot_number, plot_type_id, status) VALUES
('LL-001', 1, 'available'),
('LL-002', 1, 'available'),
('GL-001', 2, 'available'),
('GL-002', 2, 'available'),
('MML-001', 3, 'available'),
('ML-001', 4, 'available'),
('RAN-001', 5, 'available'),
('RAN-002', 5, 'available');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('company_name', 'Sanctuario de Santa Rosa de Lima Memorial Park', 'Company name'),
('company_address', '2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay', 'Company address'),
('company_phone', '09454785649 / 09684412511', 'Company phone numbers'),
('company_email', 'lrdvc.sanctuario22@gmail.com', 'Company email'),
('company_facebook', 'Sanctuario de Santa Rosa de Lima', 'Facebook page name');