-- Blood Donor Finder Database Schema
CREATE DATABASE IF NOT EXISTS blood_donor_db_2;
USE blood_donor_db_2;

-- Users table (donors & general users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  address TEXT,
  age INT,
  gender ENUM('Male', 'Female', 'Other'),
  is_donor BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  last_donation_date DATE,
  profile_image VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requester_id INT NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  units_required INT NOT NULL DEFAULT 1,
  hospital_name VARCHAR(200) NOT NULL,
  hospital_city VARCHAR(100) NOT NULL,
  hospital_state VARCHAR(100),
  contact_phone VARCHAR(20) NOT NULL,
  urgency ENUM('Critical', 'Urgent', 'Normal') DEFAULT 'Normal',
  status ENUM('Open', 'Fulfilled', 'Closed') DEFAULT 'Open',
  description TEXT,
  required_by DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  request_id INT,
  donation_date DATE NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  units_donated INT DEFAULT 1,
  hospital_name VARCHAR(200),
  city VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE SET NULL
);

-- Blood camps table
CREATE TABLE IF NOT EXISTS blood_camps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizer_name VARCHAR(100) NOT NULL,
  camp_name VARCHAR(200) NOT NULL,
  location TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  camp_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Testimonials / Success stories
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  author_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user (password: Admin@123)
INSERT INTO users (full_name, email, password, phone, blood_group, city, state, role, is_donor, is_available)
VALUES (
  'Admin User',
  'admin@bloodfinder.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  '9999999999',
  'O+',
  'Chennai',
  'Tamil Nadu',
  'admin',
  FALSE,
  FALSE
) ON DUPLICATE KEY UPDATE id=id;

-- Sample donors
INSERT INTO users (full_name, email, password, phone, blood_group, city, state, age, gender, is_donor, is_available) VALUES
('Arjun Kumar', 'arjun@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'A+', 'Chennai', 'Tamil Nadu', 28, 'Male', TRUE, TRUE),
('Priya Sharma', 'priya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543211', 'B+', 'Mumbai', 'Maharashtra', 25, 'Female', TRUE, TRUE),
('Rahul Singh', 'rahul@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543212', 'O-', 'Delhi', 'Delhi', 32, 'Male', TRUE, TRUE),
('Sneha Patel', 'sneha@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543213', 'AB+', 'Bangalore', 'Karnataka', 27, 'Female', TRUE, TRUE),
('Vikram Reddy', 'vikram@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543214', 'O+', 'Hyderabad', 'Telangana', 30, 'Male', TRUE, FALSE)
ON DUPLICATE KEY UPDATE id=id;

-- Sample blood camps
INSERT INTO blood_camps (organizer_name, camp_name, location, city, state, camp_date, start_time, end_time, contact_phone, description, is_active) VALUES
('Red Cross Society', 'Annual Blood Donation Drive 2025', 'Town Hall, Anna Salai', 'Chennai', 'Tamil Nadu', '2025-08-15', '08:00:00', '17:00:00', '9000000001', 'Annual blood donation drive organized by Red Cross. All blood groups needed.', TRUE),
('Rotary Club Mumbai', 'Save Lives Camp', 'Shivaji Park', 'Mumbai', 'Maharashtra', '2025-07-20', '09:00:00', '16:00:00', '9000000002', 'Community blood donation camp. Refreshments provided for donors.', TRUE)
ON DUPLICATE KEY UPDATE id=id;
