<?php
/**
 * Process Inquiry Form
 * Sanctuario de Santa Rosa de Lima Memorial Park Management System
 */

require_once 'includes/functions.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'message' => 'Invalid request method'], 405);
}

// Validate required fields
$required_fields = ['name', 'email', 'subject', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    sendJsonResponse([
        'success' => false, 
        'message' => 'Please fill in all required fields: ' . implode(', ', $missing_fields)
    ], 400);
}

// Sanitize input data
$name = sanitize($_POST['name']);
$email = sanitize($_POST['email']);
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$subject = sanitize($_POST['subject']);
$message = sanitize($_POST['message']);

// Validate email
if (!validateEmail($email)) {
    sendJsonResponse(['success' => false, 'message' => 'Please enter a valid email address'], 400);
}

// Validate name length
if (strlen($name) < 2 || strlen($name) > 100) {
    sendJsonResponse(['success' => false, 'message' => 'Name must be between 2 and 100 characters'], 400);
}

// Validate subject length
if (strlen($subject) < 5 || strlen($subject) > 200) {
    sendJsonResponse(['success' => false, 'message' => 'Subject must be between 5 and 200 characters'], 400);
}

// Validate message length
if (strlen($message) < 10 || strlen($message) > 1000) {
    sendJsonResponse(['success' => false, 'message' => 'Message must be between 10 and 1000 characters'], 400);
}

// Validate phone number if provided
if (!empty($phone)) {
    // Basic phone validation (adjust regex as needed for your region)
    if (!preg_match('/^[\+]?[0-9\s\-\(\)]{7,15}$/', $phone)) {
        sendJsonResponse(['success' => false, 'message' => 'Please enter a valid phone number'], 400);
    }
}

try {
    $db = getDB();
    
    // Check if user exists (for logged-in clients)
    $client_id = null;
    if (isLoggedIn() && isClient()) {
        $client_id = $_SESSION['user_id'];
    }
    
    // Insert inquiry into database
    $stmt = $db->prepare("
        INSERT INTO inquiries (name, email, phone, subject, message, client_id, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'unread', NOW())
    ");
    
    $result = $stmt->execute([$name, $email, $phone, $subject, $message, $client_id]);
    
    if ($result) {
        $inquiry_id = $db->lastInsertId();
        
        // Log activity
        logActivity('inquiry_submitted', 'inquiries', $inquiry_id, "New inquiry from $name ($email)");
        
        // Send email notification to admin (optional)
        sendInquiryNotification($name, $email, $phone, $subject, $message);
        
        sendJsonResponse([
            'success' => true, 
            'message' => 'Thank you! Your inquiry has been sent successfully. We will get back to you soon.',
            'inquiry_id' => $inquiry_id
        ]);
    } else {
        sendJsonResponse(['success' => false, 'message' => 'Failed to save inquiry. Please try again.'], 500);
    }
    
} catch (PDOException $e) {
    error_log("Database error in process_inquiry.php: " . $e->getMessage());
    sendJsonResponse(['success' => false, 'message' => 'An error occurred. Please try again later.'], 500);
} catch (Exception $e) {
    error_log("General error in process_inquiry.php: " . $e->getMessage());
    sendJsonResponse(['success' => false, 'message' => 'An error occurred. Please try again later.'], 500);
}

/**
 * Send email notification to admin about new inquiry
 */
function sendInquiryNotification($name, $email, $phone, $subject, $message) {
    $admin_email = getSetting('contact_email');
    
    if (!$admin_email) {
        return false;
    }
    
    $site_name = getSetting('site_name');
    $email_subject = "New Inquiry: $subject";
    
    $email_body = "
    <html>
    <head>
        <title>New Inquiry Received</title>
    </head>
    <body>
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        " . (!empty($phone) ? "<p><strong>Phone:</strong> $phone</p>" : "") . "
        <p><strong>Subject:</strong> $subject</p>
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
        <hr>
        <p><em>This inquiry was submitted from the $site_name website.</em></p>
    </body>
    </html>
    ";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $site_name . ' <noreply@sanctuario.com>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($admin_email, $email_subject, $email_body, implode("\r\n", $headers));
}
?>