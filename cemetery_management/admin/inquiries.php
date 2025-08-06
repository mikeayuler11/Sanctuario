<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);

$database = new Database();
$db = $database->getConnection();

// Handle reply submission
if ($_POST && isset($_POST['reply_inquiry'])) {
    $inquiry_id = $_POST['inquiry_id'];
    $reply = $_POST['reply'];
    $replied_by = $_SESSION['user_id'];
    
    $query = "UPDATE inquiries SET reply = :reply, replied_by = :replied_by, replied_at = NOW(), status = 'replied' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':reply', $reply);
    $stmt->bindParam(':replied_by', $replied_by);
    $stmt->bindParam(':id', $inquiry_id);
    
    if ($stmt->execute()) {
        $success_message = "Reply sent successfully!";
    } else {
        $error_message = "Error sending reply. Please try again.";
    }
}

// Handle mark as read
if (isset($_GET['mark_read'])) {
    $inquiry_id = $_GET['mark_read'];
    $query = "UPDATE inquiries SET status = 'read' WHERE id = :id AND status = 'unread'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $inquiry_id);
    $stmt->execute();
}

// Handle search and filters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';

// Build query based on filters
$query = "
    SELECT 
        i.*,
        CONCAT(u.first_name, ' ', u.last_name) as replied_by_name
    FROM inquiries i
    LEFT JOIN users u ON i.replied_by = u.id
    WHERE 1=1
";

$params = [];

if (!empty($search)) {
    $query .= " AND (i.name LIKE :search OR i.email LIKE :search OR i.subject LIKE :search OR i.message LIKE :search)";
    $params[':search'] = "%$search%";
}

if (!empty($status_filter)) {
    $query .= " AND i.status = :status";
    $params[':status'] = $status_filter;
}

$query .= " ORDER BY i.created_at DESC";

$stmt = $db->prepare($query);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->execute();
$inquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiries - Cemetery Management System</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-cross"></i> Cemetery Management</h2>
                <p style="color: #bdc3c7; font-size: 0.9rem;"><?php echo $_SESSION['full_name']; ?></p>
                <p style="color: #95a5a6; font-size: 0.8rem; text-transform: uppercase;"><?php echo $_SESSION['user_type']; ?></p>
            </div>
            <ul class="sidebar-nav">
                <li><a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="map.php"><i class="fas fa-map"></i> Map</a></li>
                <li><a href="grave_management.php"><i class="fas fa-bed"></i> Grave Management</a></li>
                <li><a href="amortization.php"><i class="fas fa-calculator"></i> Amortization</a></li>
                <li><a href="inquiries.php" class="active"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="maintenance.php"><i class="fas fa-tools"></i> Maintenance</a></li>
                <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>Inquiries Management</h1>
                <p class="breadcrumb">Home > Inquiries</p>
            </div>

            <?php if (isset($success_message)): ?>
                <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $success_message; ?>
                </div>
            <?php endif; ?>

            <?php if (isset($error_message)): ?>
                <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>

            <!-- Inquiries Table -->
            <div class="table-container">
                <div class="table-header">
                    <h3 class="table-title"><i class="fas fa-envelope"></i> Customer Inquiries</h3>
                    <div class="table-controls">
                        <form method="GET" style="display: flex; gap: 1rem; align-items: center;">
                            <input type="text" name="search" class="search-box" placeholder="Search inquiries..." value="<?php echo htmlspecialchars($search); ?>">
                            
                            <select name="status" class="filter-select">
                                <option value="">All Status</option>
                                <option value="unread" <?php echo $status_filter == 'unread' ? 'selected' : ''; ?>>Unread</option>
                                <option value="read" <?php echo $status_filter == 'read' ? 'selected' : ''; ?>>Read</option>
                                <option value="replied" <?php echo $status_filter == 'replied' ? 'selected' : ''; ?>>Replied</option>
                            </select>
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Search
                            </button>
                            
                            <a href="inquiries.php" class="btn btn-secondary">
                                <i class="fas fa-refresh"></i> Reset
                            </a>
                        </form>
                    </div>
                </div>
                
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($inquiries)): ?>
                                <tr>
                                    <td colspan="8" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                                        No inquiries found.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($inquiries as $inquiry): ?>
                                    <tr style="<?php echo $inquiry['status'] == 'unread' ? 'background-color: #fff3cd;' : ''; ?>">
                                        <td>
                                            <span class="status-badge <?php 
                                                echo $inquiry['status'] == 'replied' ? 'status-active' : 
                                                    ($inquiry['status'] == 'unread' ? 'status-pending' : 'status-inactive'); 
                                            ?>">
                                                <?php echo ucfirst($inquiry['status']); ?>
                                            </span>
                                        </td>
                                        <td><?php echo date('M j, Y g:i A', strtotime($inquiry['created_at'])); ?></td>
                                        <td><?php echo htmlspecialchars($inquiry['name']); ?></td>
                                        <td>
                                            <strong><?php echo htmlspecialchars($inquiry['subject']); ?></strong>
                                            <?php if (strlen($inquiry['message']) > 50): ?>
                                                <br><small style="color: #7f8c8d;">
                                                    <?php echo htmlspecialchars(substr($inquiry['message'], 0, 50) . '...'); ?>
                                                </small>
                                            <?php endif; ?>
                                        </td>
                                        <td><?php echo htmlspecialchars($inquiry['email']); ?></td>
                                        <td><?php echo htmlspecialchars($inquiry['phone'] ?? 'N/A'); ?></td>
                                        <td><?php echo htmlspecialchars($inquiry['address'] ?? 'N/A'); ?></td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="viewInquiry(<?php echo $inquiry['id']; ?>)">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                            <?php if ($inquiry['status'] == 'unread'): ?>
                                                <a href="?mark_read=<?php echo $inquiry['id']; ?>" class="btn btn-secondary btn-sm">
                                                    <i class="fas fa-check"></i> Mark Read
                                                </a>
                                            <?php endif; ?>
                                            <?php if ($inquiry['status'] != 'replied'): ?>
                                                <button class="btn btn-secondary btn-sm" onclick="replyInquiry(<?php echo $inquiry['id']; ?>)">
                                                    <i class="fas fa-reply"></i> Reply
                                                </button>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <!-- View Inquiry Modal -->
    <div id="viewInquiryModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeViewModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-envelope"></i> Inquiry Details
            </h2>
            <div id="inquiryDetails">
                <!-- Inquiry details will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Reply Modal -->
    <div id="replyModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeReplyModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-reply"></i> Reply to Inquiry
            </h2>
            <form method="POST" id="replyForm">
                <input type="hidden" name="inquiry_id" id="reply_inquiry_id">
                <div id="originalInquiry" style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <!-- Original inquiry will be loaded here -->
                </div>
                <div class="form-group">
                    <label for="reply">Your Reply</label>
                    <textarea id="reply" name="reply" rows="6" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;" required placeholder="Type your reply here..."></textarea>
                </div>
                <button type="submit" name="reply_inquiry" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> Send Reply
                </button>
            </form>
        </div>
    </div>

    <script>
        // Sample inquiry data (in real implementation, this would come from PHP/AJAX)
        const inquiriesData = <?php echo json_encode($inquiries); ?>;

        function viewInquiry(inquiryId) {
            const inquiry = inquiriesData.find(inq => inq.id == inquiryId);
            if (inquiry) {
                document.getElementById('inquiryDetails').innerHTML = `
                    <div style="padding: 1rem;">
                        <div style="margin-bottom: 1rem;">
                            <strong>From:</strong> ${inquiry.name}<br>
                            <strong>Email:</strong> ${inquiry.email}<br>
                            <strong>Phone:</strong> ${inquiry.phone || 'N/A'}<br>
                            <strong>Address:</strong> ${inquiry.address || 'N/A'}<br>
                            <strong>Date:</strong> ${new Date(inquiry.created_at).toLocaleDateString()}<br>
                            <strong>Status:</strong> <span class="status-badge">${inquiry.status}</span>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Subject:</strong><br>
                            <p style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">${inquiry.subject}</p>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Message:</strong><br>
                            <p style="background: #f8f9fa; padding: 1rem; border-radius: 5px; white-space: pre-wrap;">${inquiry.message}</p>
                        </div>
                        ${inquiry.reply ? `
                            <div>
                                <strong>Reply:</strong><br>
                                <p style="background: #e8f5e8; padding: 1rem; border-radius: 5px; white-space: pre-wrap;">${inquiry.reply}</p>
                                <small style="color: #7f8c8d;">Replied by: ${inquiry.replied_by_name || 'N/A'} on ${inquiry.replied_at ? new Date(inquiry.replied_at).toLocaleDateString() : 'N/A'}</small>
                            </div>
                        ` : ''}
                    </div>
                `;
                document.getElementById('viewInquiryModal').style.display = 'block';
            }
        }

        function replyInquiry(inquiryId) {
            const inquiry = inquiriesData.find(inq => inq.id == inquiryId);
            if (inquiry) {
                document.getElementById('reply_inquiry_id').value = inquiryId;
                document.getElementById('originalInquiry').innerHTML = `
                    <strong>Original Inquiry:</strong><br>
                    <strong>From:</strong> ${inquiry.name} (${inquiry.email})<br>
                    <strong>Subject:</strong> ${inquiry.subject}<br>
                    <strong>Message:</strong><br>
                    <p style="margin-top: 0.5rem; font-style: italic;">${inquiry.message}</p>
                `;
                document.getElementById('replyModal').style.display = 'block';
            }
        }

        function closeViewModal() {
            document.getElementById('viewInquiryModal').style.display = 'none';
        }

        function closeReplyModal() {
            document.getElementById('replyModal').style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const viewModal = document.getElementById('viewInquiryModal');
            const replyModal = document.getElementById('replyModal');
            if (event.target == viewModal) {
                closeViewModal();
            }
            if (event.target == replyModal) {
                closeReplyModal();
            }
        }
    </script>
</body>
</html>