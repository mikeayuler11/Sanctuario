<?php
/**
 * Utility Functions
 * Sanctuario de Santa Rosa de Lima Memorial Park Management System
 */

session_start();

// Database connection
require_once '../config/database.php';

/**
 * Get database connection
 */
function getDB() {
    $database = new Database();
    return $database->getConnection();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Check if user has specific role
 */
function hasRole($role) {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === $role;
}

/**
 * Check if user is admin
 */
function isAdmin() {
    return hasRole('admin');
}

/**
 * Check if user is staff
 */
function isStaff() {
    return hasRole('staff');
}

/**
 * Check if user is client
 */
function isClient() {
    return hasRole('client');
}

/**
 * Redirect to specific page
 */
function redirect($url) {
    header("Location: $url");
    exit();
}

/**
 * Sanitize input data
 */
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Hash password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate random string
 */
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

/**
 * Format date
 */
function formatDate($date, $format = 'M d, Y') {
    return date($format, strtotime($date));
}

/**
 * Format currency
 */
function formatCurrency($amount) {
    return '₱' . number_format($amount, 2);
}

/**
 * Get system setting
 */
function getSetting($key) {
    $db = getDB();
    $stmt = $db->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
    $stmt->execute([$key]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['setting_value'] : null;
}

/**
 * Log activity
 */
function logActivity($action, $tableName = null, $recordId = null, $details = null) {
    $db = getDB();
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $stmt = $db->prepare("INSERT INTO activity_logs (user_id, action, table_name, record_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $action, $tableName, $recordId, $details, $ipAddress, $userAgent]);
}

/**
 * Display flash message
 */
function setFlashMessage($type, $message) {
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

function getFlashMessage() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Check if request is AJAX
 */
function isAjaxRequest() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/**
 * Send JSON response
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

/**
 * Get user by ID
 */
function getUserById($id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

/**
 * Get current user data
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    return getUserById($_SESSION['user_id']);
}

/**
 * Check if user can access resource
 */
function canAccess($resource, $resourceId = null) {
    if (isAdmin()) {
        return true;
    }
    
    if (isStaff()) {
        // Staff can access most resources except user management
        return $resource !== 'users';
    }
    
    if (isClient()) {
        // Clients can only access their own resources
        if ($resourceId) {
            $currentUser = getCurrentUser();
            // Add specific checks for different resources
            switch ($resource) {
                case 'graves':
                case 'amortizations':
                case 'inquiries':
                    $db = getDB();
                    $stmt = $db->prepare("SELECT COUNT(*) FROM $resource WHERE id = ? AND client_id = ?");
                    $stmt->execute([$resourceId, $currentUser['id']]);
                    return $stmt->fetchColumn() > 0;
            }
        }
        return in_array($resource, ['profile', 'dashboard', 'map']);
    }
    
    return false;
}
?>