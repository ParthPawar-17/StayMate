import React, { useState } from 'react';
import {
  X,
  Database,
  FileCode,
  Download,
  Copy,
  Check,
  Server,
  Layers,
  ShieldCheck,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface CollegeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeProjectModal: React.FC<CollegeProjectModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'sql' | 'php-auth' | 'php-props' | 'setup'>(
    'schema'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([SQL_SCHEMA_CODE], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'staymate_database.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 text-white my-8">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold font-['Outfit'] text-white">
                  College Project Source & MySQL Schema
                </h2>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  PHP + MySQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Normalized Relational Database Architecture & Backend RESTful APIs for Viva
                Evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadSQL}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download database.sql</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-950/60 px-6 py-2.5 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'schema' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Relational Schema (5 Tables)</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'sql' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>database.sql Dump</span>
          </button>

          <button
            onClick={() => setActiveTab('php-auth')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'php-auth'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>auth.php (Password Hash)</span>
          </button>

          <button
            onClick={() => setActiveTab('php-props')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'php-props'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>properties.php (Prepared SQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'setup' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>XAMPP / Deployment Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 text-xs">
                <p className="text-slate-300 font-medium">
                  The database adheres to 3rd Normal Form (3NF). Many-to-many relationship between{' '}
                  <code className="text-purple-300 font-bold">properties</code> and{' '}
                  <code className="text-purple-300 font-bold">amenities</code> is decomposed via the
                  junction table <code className="text-purple-300 font-bold">property_amenities</code>
                  . Student inquiries and bookings are tracked via{' '}
                  <code className="text-purple-300 font-bold">interested_users</code> with cascading
                  foreign keys.
                </p>
              </div>

              {/* 5 Schema Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. users */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-amber-400 text-xs font-mono">1. users</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      Primary Entity
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>
                      <span className="text-amber-400 font-bold">id</span> INT (PK, AUTO_INC)
                    </li>
                    <li>name VARCHAR(120)</li>
                    <li>email VARCHAR(150) UNIQUE</li>
                    <li>password VARCHAR(255) [BCRYPT]</li>
                    <li>phone VARCHAR(20)</li>
                    <li>role ENUM('student', 'admin')</li>
                    <li>college VARCHAR(150)</li>
                    <li>created_at TIMESTAMP</li>
                  </ul>
                </div>

                {/* 2. properties */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-purple-400 text-xs font-mono">
                      2. properties
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      Accommodations
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>
                      <span className="text-purple-400 font-bold">id</span> INT (PK, AUTO_INC)
                    </li>
                    <li>name VARCHAR(200)</li>
                    <li>city VARCHAR(80)</li>
                    <li>location VARCHAR(150)</li>
                    <li>price DECIMAL(10,2)</li>
                    <li>deposit DECIMAL(10,2)</li>
                    <li>gender ENUM('Boys', 'Girls', 'Co-living')</li>
                    <li>rating DECIMAL(2,1)</li>
                    <li>description TEXT</li>
                    <li>image VARCHAR(500)</li>
                  </ul>
                </div>

                {/* 3. amenities */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-emerald-400 text-xs font-mono">
                      3. amenities
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      Master Table
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>
                      <span className="text-emerald-400 font-bold">id</span> INT (PK, AUTO_INC)
                    </li>
                    <li>name VARCHAR(100) UNIQUE</li>
                    <li>category VARCHAR(50)</li>
                  </ul>
                </div>

                {/* 4. property_amenities */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-indigo-400 text-xs font-mono">
                      4. property_amenities
                    </span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                      M:N Junction
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>
                      <span className="text-indigo-400 font-bold">property_id</span> (FK -&gt;
                      properties.id)
                    </li>
                    <li>
                      <span className="text-indigo-400 font-bold">amenity_id</span> (FK -&gt;
                      amenities.id)
                    </li>
                    <li className="text-[11px] text-slate-400">PK: (property_id, amenity_id)</li>
                  </ul>
                </div>

                {/* 5. interested_users */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-rose-400 text-xs font-mono">
                      5. interested_users
                    </span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                      Visits & Leads
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>
                      <span className="text-rose-400 font-bold">id</span> INT (PK, AUTO_INC)
                    </li>
                    <li>user_id (FK -&gt; users.id)</li>
                    <li>property_id (FK -&gt; properties.id)</li>
                    <li>visit_date DATE</li>
                    <li>time_slot VARCHAR(50)</li>
                    <li>sharing_preference VARCHAR(60)</li>
                    <li>status ENUM(...)</li>
                    <li>notes TEXT</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">php-backend/database.sql</span>
                <button
                  onClick={() => handleCopyCode(SQL_SCHEMA_CODE)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
                {SQL_SCHEMA_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'php-auth' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">php-backend/api/auth.php</span>
                <button
                  onClick={() => handleCopyCode(PHP_AUTH_CODE)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-purple-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
                {PHP_AUTH_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'php-props' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">
                  php-backend/api/properties.php
                </span>
                <button
                  onClick={() => handleCopyCode(PHP_PROPS_CODE)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-amber-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
                {PHP_PROPS_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                How to Host & Run on XAMPP for College Demonstration
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Copy backend files:</strong> Copy the contents of `/php-backend` to your
                  XAMPP webroot at <code>C:\xampp\htdocs\staymate\</code>.
                </li>
                <li>
                  <strong>Start Apache & MySQL:</strong> Open XAMPP Control Panel and start both
                  Apache and MySQL services.
                </li>
                <li>
                  <strong>Import Database:</strong> Open phpMyAdmin at{' '}
                  <code>http://localhost/phpmyadmin</code>, create a new database named{' '}
                  <code>staymate_db</code>, and click <strong>Import</strong> -&gt; choose{' '}
                  <code>database.sql</code>.
                </li>
                <li>
                  <strong>Verify Connection:</strong> Ensure <code>/config/db_connect.php</code> has
                  username <code>root</code> and empty password.
                </li>
                <li>
                  <strong>Test APIs:</strong> Visit{' '}
                  <code>http://localhost/staymate/api/properties.php</code> to confirm JSON responses
                  stream smoothly.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SQL_SCHEMA_CODE = `-- ====================================================================
-- STAYMATE: STUDENT ACCOMMODATION & PG FINDER SYSTEM
-- Database: staymate_db
-- ====================================================================
CREATE DATABASE IF NOT EXISTS staymate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE staymate_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  college VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(80) NOT NULL DEFAULT 'Nagpur',
  location VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
  gender ENUM('Boys', 'Girls', 'Co-living') NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  review_count INT NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  contact_owner VARCHAR(120) NOT NULL,
  contact_phone VARCHAR(30) NOT NULL,
  verified TINYINT(1) DEFAULT 1,
  featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) DEFAULT 'Essentials'
) ENGINE=InnoDB;

CREATE TABLE property_amenities (
  property_id INT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (property_id, amenity_id),
  CONSTRAINT fk_pa_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_amen FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE interested_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  visit_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  sharing_preference VARCHAR(60) DEFAULT 'Double Sharing',
  status ENUM('Pending', 'Contacted', 'Visit Scheduled', 'Confirmed') DEFAULT 'Pending',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_iu_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_iu_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB;`;

const PHP_AUTH_CODE = `<?php
session_start();
require_once __DIR__ . '/../config/db_connect.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($action === 'register') {
    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];
    $phone = trim($data['phone']);
    $role = $data['role'] ?? 'student';

    // Secure password hashing with PHP BCRYPT
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hash, $phone, $role]);
    echo json_encode(['status' => 'success', 'user_id' => $pdo->lastInsertId()]);
}

if ($action === 'login') {
    $email = trim($data['email']);
    $password = $data['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        $_SESSION['user'] = $user;
        echo json_encode(['status' => 'success', 'user' => $user]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
}
?>`;

const PHP_PROPS_CODE = `<?php
require_once __DIR__ . '/../config/db_connect.php';

$city = $_GET['city'] ?? 'All';
$gender = $_GET['gender'] ?? 'All';
$maxPrice = $_GET['max_price'] ?? 999999;

$sql = "SELECT p.* FROM properties p WHERE p.price <= ?";
$params = [$maxPrice];

if ($city !== 'All') {
    $sql .= " AND p.city = ?";
    $params[] = $city;
}

if ($gender !== 'All') {
    $sql .= " AND p.gender = ?";
    $params[] = $gender;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$properties = $stmt->fetchAll();

echo json_encode(['status' => 'success', 'data' => $properties]);
?>`;
