# StayMate – Student Accommodation & PG Finder
## Final-Year College Project & Production Deployment Guide

**StayMate** is a full-stack student accommodation discovery platform designed specifically for college students to find affordable, verified PG rooms, hostels, and shared living spaces near prominent academic campuses.

---

## 1. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Bootstrap 5 UI patterns, AJAX / Fetch API.
- **Backend:** PHP 8.x with PDO prepared statements, session-based role authorization, and `password_hash()` BCRYPT encryption.
- **Database:** MySQL 8.x (Normalized relational schema with foreign key cascades and indexes).
- **Architecture:** Decoupled RESTful API endpoints + dynamic single-page application.

---

## 2. Database Design & Normalization

The relational database `staymate_db` contains 5 core normalized tables:

1. **`users`**
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Unique)
   - `password` (VARCHAR, Hashed via `password_hash(..., PASSWORD_BCRYPT)`)
   - `phone` (VARCHAR)
   - `role` (ENUM: 'student', 'admin')
   - `college` (VARCHAR)
   - `created_at` (TIMESTAMP)

2. **`properties`**
   - `id` (INT, Primary Key, Auto Increment)
   - `name`, `city`, `location`, `address`, `price`, `deposit`, `gender`, `rating`, `review_count`, `description`, `image`, `contact_owner`, `contact_phone`, `verified`, `featured`

3. **`amenities`**
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR, Unique)
   - `category` (VARCHAR: 'Essentials', 'Comfort', 'Security', 'Services')

4. **`property_amenities`**
   - `property_id` (INT, Foreign Key -> `properties.id` ON DELETE CASCADE)
   - `amenity_id` (INT, Foreign Key -> `amenities.id` ON DELETE CASCADE)
   - Primary Key: (`property_id`, `amenity_id`)

5. **`interested_users`**
   - `id` (INT, Primary Key, Auto Increment)
   - `user_id` (INT, Foreign Key -> `users.id` ON DELETE CASCADE)
   - `property_id` (INT, Foreign Key -> `properties.id` ON DELETE CASCADE)
   - `visit_date` (DATE)
   - `time_slot` (VARCHAR)
   - `sharing_preference` (VARCHAR)
   - `status` (ENUM: 'Pending', 'Contacted', 'Visit Scheduled', 'Confirmed')
   - `notes` (TEXT)
   - `created_at` (TIMESTAMP)

---

## 3. Installation on Localhost (XAMPP / WAMP / MAMP)

### Step 1: Clone or Copy Files
1. Copy the contents of `/php-backend/` into your Apache server root:
   - For XAMPP (Windows): `C:/xampp/htdocs/staymate/`
   - For WAMP (Windows): `C:/wamp64/www/staymate/`
   - For Linux LAMP: `/var/www/html/staymate/`

### Step 2: Import the Database
1. Open **phpMyAdmin** in your browser (`http://localhost/phpmyadmin`).
2. Click **New** in the sidebar, name the database `staymate_db`, and select collation `utf8mb4_unicode_ci`.
3. Select the `staymate_db` database, click on the **Import** tab.
4. Choose the `database.sql` file located in the root of the project.
5. Click **Go / Import**. All 5 tables, foreign keys, and seed data will be created instantly.

### Step 3: Configure Database Connection
Edit `/config/db_connect.php`:
```php
$host     = 'localhost';
$db_name  = 'staymate_db';
$username = 'root';     // Default for XAMPP
$password = '';         // Leave empty for XAMPP, or set your MySQL root password
```

### Step 4: Access the Application
Open `http://localhost/staymate/` or call the PHP REST APIs:
- `http://localhost/staymate/api/properties.php?city=Nagpur`
- `http://localhost/staymate/api/auth.php?action=login`

---

## 4. Test Accounts & Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `rahul@vnit.ac.in` | `password123` | Shortlist PGs, Book Visits, View Dashboard |
| **Demo Admin** | `admin@staymate.in` | `admin123` | Add/Edit/Delete Properties, Manage Inquiries, Manage Amenities |

---

## 5. Security & Academic Viva Highlights

- **Password Hashing:** Passwords are never stored in plaintext. They utilize PHP's industry-standard `password_hash($pass, PASSWORD_BCRYPT)` and are verified via `password_verify($input, $hash)`.
- **SQL Injection Prevention:** 100% of queries use PDO prepared statements with parameter binding (`?` placeholders).
- **Cross-Site Scripting (XSS):** Sanitized user inputs with `htmlspecialchars()` and type casting.
- **Role-Based Access Control (RBAC):** Admin endpoints verify `$_SESSION['user']['role'] === 'admin'` before allowing mutation actions.
