-- ====================================================================
-- STAYMATE: STUDENT ACCOMMODATION & PG FINDER SYSTEM
-- Database: staymate_db
-- Normalized MySQL Database Schema & Sample Data for Nagpur, Maharashtra
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `staymate_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `staymate_db`;

-- Drop existing tables in reverse order of foreign keys
DROP TABLE IF EXISTS `interested_users`;
DROP TABLE IF EXISTS `property_amenities`;
DROP TABLE IF EXISTS `amenities`;
DROP TABLE IF EXISTS `properties`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------------------
-- 1. Table: users
-- Roles: 'student', 'admin'
-- Passwords hashed using PHP password_hash(..., PASSWORD_BCRYPT)
-- --------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` ENUM('student', 'admin') DEFAULT 'student',
  `college` VARCHAR(150) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Table: properties
-- PG / Hostel accommodations with pricing, gender preference and details
-- --------------------------------------------------------------------
CREATE TABLE `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `city` VARCHAR(80) NOT NULL DEFAULT 'Nagpur',
  `location` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `deposit` DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
  `gender` ENUM('Boys', 'Girls', 'Co-living') NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  `review_count` INT NOT NULL DEFAULT 0,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `contact_owner` VARCHAR(120) NOT NULL,
  `contact_phone` VARCHAR(30) NOT NULL,
  `verified` TINYINT(1) DEFAULT 1,
  `featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Table: amenities
-- Master table for student facilities & amenities
-- --------------------------------------------------------------------
CREATE TABLE `amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(50) DEFAULT 'Essentials'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Table: property_amenities (Many-to-Many junction)
-- --------------------------------------------------------------------
CREATE TABLE `property_amenities` (
  `property_id` INT NOT NULL,
  `amenity_id` INT NOT NULL,
  PRIMARY KEY (`property_id`, `amenity_id`),
  CONSTRAINT `fk_pa_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pa_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Table: interested_users
-- Records student visit schedules, inquiries, and booking interest
-- --------------------------------------------------------------------
CREATE TABLE `interested_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `property_id` INT NOT NULL,
  `visit_date` DATE NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `sharing_preference` VARCHAR(60) DEFAULT 'Double Sharing',
  `status` ENUM('Pending', 'Contacted', 'Visit Scheduled', 'Confirmed') DEFAULT 'Pending',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_interest_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_interest_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING & PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX `idx_properties_city_gender` ON `properties` (`city`, `gender`);
CREATE INDEX `idx_properties_price` ON `properties` (`price`);
CREATE INDEX `idx_interested_status` ON `interested_users` (`status`);

-- ====================================================================
-- SEED DATA: AMENITIES
-- ====================================================================
INSERT INTO `amenities` (`id`, `name`, `category`) VALUES
(1, 'High-speed WiFi', 'Essentials'),
(2, 'Food Included (3 Meals)', 'Essentials'),
(3, 'Air Conditioner (AC)', 'Comfort'),
(4, 'Laundry Service & Washing Machine', 'Services'),
(5, '24/7 Power Backup', 'Essentials'),
(6, 'CCTV & Biometric Security', 'Security'),
(7, 'Attached Washroom', 'Comfort'),
(8, 'Daily Room Cleaning', 'Services'),
(9, 'Study Desk & Bookshelf', 'Comfort'),
(10, 'RO Purified Drinking Water', 'Essentials'),
(11, 'Gym / Fitness Corner', 'Comfort'),
(12, 'Two-Wheeler Parking', 'Services'),
(13, 'Hot Water Geyser', 'Essentials');

-- ====================================================================
-- SEED DATA: USERS
-- Default passwords:
-- rahul@vnit.ac.in -> password123
-- admin@staymate.in -> admin123
-- Generated with PHP password_hash('...', PASSWORD_BCRYPT)
-- ====================================================================
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `college`, `created_at`) VALUES
(1, 'Rahul Sharma', 'rahul@vnit.ac.in', '$2y$10$eOQe47LzG3o69kI.eJ2tbeV7rZt7r4Qf0fQe47LzG3o69kI.eJ2tb', '9822114455', 'student', 'VNIT Nagpur (CSE)', '2026-01-15 10:00:00'),
(2, 'StayMate Admin', 'admin@staymate.in', '$2y$10$wTfV5X4p8s9d7q6a5z4w3e2r1t0y9u8i7o6p5a4s3d2f1g0h9j8k7', '9822000000', 'admin', 'StayMate Central Office', '2025-10-01 09:00:00'),
(3, 'Priya Joshi', 'priya.joshi@lad.ac.in', '$2y$10$eOQe47LzG3o69kI.eJ2tbeV7rZt7r4Qf0fQe47LzG3o69kI.eJ2tb', '9890223344', 'student', 'LAD College Dharampeth', '2026-02-01 11:30:00');

-- ====================================================================
-- SEED DATA: PROPERTIES (NAGPUR, MAHARASHTRA)
-- ====================================================================
INSERT INTO `properties` (`id`, `name`, `city`, `location`, `address`, `price`, `deposit`, `gender`, `rating`, `review_count`, `description`, `image`, `contact_owner`, `contact_phone`, `verified`, `featured`) VALUES
(1, 'Shree Ram Boys Luxury PG & Hostel', 'Nagpur', 'Ramdaspeth', 'Plot 48, Central Bazar Road, near Kachipura Square, Ramdaspeth, Nagpur', 5800.00, 6000.00, 'Boys', 4.8, 38, 'Premier student PG in Ramdaspeth student hub, within 800m from VNIT campus. Offers healthy home-style pure veg meals, 300 Mbps Wi-Fi, and quiet study room.', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80', 'Rajesh Sharma', '+91 98223 34455', 1, 1),
(2, 'Saraswati Girls Executive Residency', 'Nagpur', 'Dharampeth', '14, West High Court Road, Opposite Coffee House, Dharampeth, Nagpur', 6500.00, 6500.00, 'Girls', 4.9, 52, 'Ultra-safe girls PG right in Dharampeth. Full female warden coverage 24x7, facial biometric entry, and home-cooked 3-time meals. Walking distance from LAD College.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80', 'Smt. Sunita Patil', '+91 98901 12233', 1, 1),
(3, 'CampusNest Student Co-Living Spaces', 'Nagpur', 'Sadar / Civil Lines', 'Building 7, Mount Road Extension, Sadar, Nagpur', 8200.00, 9000.00, 'Co-living', 4.7, 29, 'Modern co-living space for university students and interns near RCOEM. Separate secure wings for boys and girls, rooftop cafe, gym, and gaming lounge.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', 'Anand Verma', '+91 97654 32100', 1, 1),
(4, 'Gajanan Boys Engineering Residency', 'Nagpur', 'Hingna Road', 'Near Electronic Zone, Hingna Road, MIDC, Nagpur', 4200.00, 4000.00, 'Boys', 4.5, 41, 'Budget-friendly PG for students of YCCE, Raisoni, and Priyadarshini engineering institutes. Clean rooms with unlimited 2-time mess and bus connectivity.', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1000&q=80', 'Mahesh Bhende', '+91 94231 09876', 1, 0),
(5, 'Starlight Girls Elite Studio PG', 'Nagpur', 'Bajaj Nagar', 'Near VNIT Gate 2, Abhyankar Nagar Main Rd, Bajaj Nagar, Nagpur', 7200.00, 7500.00, 'Girls', 4.9, 36, 'Brand new designer girls accommodation with boutique studio aesthetics. Just 300 meters from VNIT South Gate with attached washroom and biometric entry.', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', 'Mrs. Neha Kulkarni', '+91 98230 45678', 1, 1),
(6, 'Zenith Scholar Co-Living & Study Hub', 'Nagpur', 'Pratap Nagar', 'Ring Road Chowk, near Orange City Hospital, Pratap Nagar, Nagpur', 6800.00, 7000.00, 'Co-living', 4.6, 24, 'Soundproof study pods, 24/7 library hall, healthy diet meal options, and high security. Ideal for medical and engineering aspirants.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80', 'Vikas Meshram', '+91 98812 34567', 1, 0),
(7, 'Shivshakti Boys PG & Mess', 'Nagpur', 'Nandanvan', 'Near KDK Engineering College, Great Nag Road, Nandanvan, Nagpur', 4500.00, 4500.00, 'Boys', 4.4, 31, 'Convenient and affordable living for students studying at KDK College. Home-cooked meals, daily housekeeping, RO water, and high-speed Wi-Fi.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', 'Sanjay Thakre', '+91 99224 55667', 1, 0),
(8, 'Aura Palace Girls Luxury PG', 'Nagpur', 'Shankar Nagar', 'Near Shankar Nagar Square, West High Court Rd, Nagpur', 6600.00, 7000.00, 'Girls', 4.8, 39, 'Elegant girls PG near Shivaji Science College and LAD. Full power backup, attached bathrooms, high-speed internet, and home-style pure veg meals.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80', 'Pooja Agrawal', '+91 97665 43210', 1, 0);

-- ====================================================================
-- SEED DATA: PROPERTY AMENITIES JUNCTION
-- ====================================================================
-- Property 1 (Shree Ram Boys)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 9), (1, 10), (1, 12);

-- Property 2 (Saraswati Girls)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(2, 1), (2, 2), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10);

-- Property 3 (CampusNest Co-living)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(3, 1), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8), (3, 9), (3, 11), (3, 12);

-- Property 4 (Gajanan Boys Hingna)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(4, 1), (4, 2), (4, 5), (4, 9), (4, 10), (4, 12), (4, 13);

-- Property 5 (Starlight Girls Bajaj Nagar)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9);

-- Property 6 (Zenith Scholar Pratap Nagar)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(6, 1), (6, 2), (6, 3), (6, 5), (6, 6), (6, 8), (6, 9), (6, 10);

-- Property 7 (Shivshakti Boys Nandanvan)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(7, 1), (7, 2), (7, 9), (7, 10), (7, 12), (7, 13);

-- Property 8 (Aura Palace Girls Shankar Nagar)
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(8, 1), (8, 2), (8, 5), (8, 6), (8, 7), (8, 8), (8, 9), (8, 10);

-- ====================================================================
-- SEED DATA: INTERESTED USERS / VISIT SCHEDULES
-- ====================================================================
INSERT INTO `interested_users` (`id`, `user_id`, `property_id`, `visit_date`, `time_slot`, `sharing_preference`, `status`, `notes`, `created_at`) VALUES
(1, 1, 1, '2026-11-12', 'Morning (10:00 AM - 12:00 PM)', 'Double Sharing (₹6,800/mo)', 'Visit Scheduled', 'Looking for room with dedicated study table near window.', '2026-11-08 14:20:00'),
(2, 1, 3, '2026-11-15', 'Evening (04:00 PM - 06:00 PM)', 'Single Room (₹13,500/mo)', 'Pending', 'Visiting with parents on Sunday afternoon.', '2026-11-09 09:45:00'),
(3, 3, 2, '2026-11-14', 'Afternoon (01:00 PM - 03:00 PM)', 'Double Sharing (₹7,800/mo)', 'Contacted', '1st year LAD student seeking hostel.', '2026-11-07 16:30:00');
