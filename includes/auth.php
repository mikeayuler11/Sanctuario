<?php
session_start();
require_once '../config/database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function login($username, $password) {
        try {
            $stmt = $this->db->query(
                "SELECT * FROM users WHERE (username = ? OR email = ?) AND status = 'active'", 
                [$username, $username]
            );
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_type'] = $user['user_type'];
                $_SESSION['full_name'] = $user['first_name'] . ' ' . $user['last_name'];
                
                // Update last login
                $this->db->query(
                    "UPDATE users SET last_login = NOW() WHERE id = ?", 
                    [$user['id']]
                );
                
                // Log activity
                $this->logActivity($user['id'], 'Login', 'User logged in successfully');
                
                return [
                    'success' => true,
                    'user_type' => $user['user_type'],
                    'message' => 'Login successful'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Invalid username/email or password'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Login error: ' . $e->getMessage()
            ];
        }
    }
    
    public function register($data) {
        try {
            // Check if username or email already exists
            $stmt = $this->db->query(
                "SELECT id FROM users WHERE username = ? OR email = ?", 
                [$data['username'], $data['email']]
            );
            if ($stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Username or email already exists'
                ];
            }
            
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $stmt = $this->db->query(
                "INSERT INTO users (username, email, password, user_type, first_name, last_name, phone, address) 
                 VALUES (?, ?, ?, 'client', ?, ?, ?, ?)",
                [
                    $data['username'],
                    $data['email'],
                    $hashedPassword,
                    $data['first_name'],
                    $data['last_name'],
                    $data['phone'],
                    $data['address']
                ]
            );
            
            return [
                'success' => true,
                'message' => 'Registration successful. You can now login.'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Registration error: ' . $e->getMessage()
            ];
        }
    }
    
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            $this->logActivity($_SESSION['user_id'], 'Logout', 'User logged out');
        }
        session_destroy();
        return true;
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public function getUserType() {
        return isset($_SESSION['user_type']) ? $_SESSION['user_type'] : null;
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: ../index.php');
            exit();
        }
    }
    
    public function requireAdmin() {
        $this->requireLogin();
        if ($this->getUserType() !== 'admin') {
            header('Location: ../unauthorized.php');
            exit();
        }
    }
    
    public function requireStaffOrAdmin() {
        $this->requireLogin();
        $userType = $this->getUserType();
        if ($userType !== 'admin' && $userType !== 'staff') {
            header('Location: ../unauthorized.php');
            exit();
        }
    }
    
    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            $stmt = $this->db->query("SELECT * FROM users WHERE id = ?", [$_SESSION['user_id']]);
            return $stmt->fetch();
        }
        return null;
    }
    
    private function logActivity($userId, $action, $description) {
        try {
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $this->db->query(
                "INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)",
                [$userId, $action, $description, $ipAddress]
            );
        } catch (Exception $e) {
            // Log error but don't break the flow
        }
    }
}
?>