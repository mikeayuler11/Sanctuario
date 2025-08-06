<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);

$database = new Database();
$db = $database->getConnection();

// Handle new maintenance schedule
if ($_POST && isset($_POST['schedule_maintenance'])) {
    $plot_id = $_POST['plot_id'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $performed_by = $_POST['performed_by'];
    $description = $_POST['description'];
    
    $query = "INSERT INTO maintenance (plot_id, start_date, end_date, performed_by, description) VALUES (:plot_id, :start_date, :end_date, :performed_by, :description)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':plot_id', $plot_id);
    $stmt->bindParam(':start_date', $start_date);
    $stmt->bindParam(':end_date', $end_date);
    $stmt->bindParam(':performed_by', $performed_by);
    $stmt->bindParam(':description', $description);
    
    if ($stmt->execute()) {
        $success_message = "Maintenance scheduled successfully!";
    } else {
        $error_message = "Error scheduling maintenance. Please try again.";
    }
}

// Handle status update
if ($_POST && isset($_POST['update_status'])) {
    $maintenance_id = $_POST['maintenance_id'];
    $status = $_POST['status'];
    $notes = $_POST['notes'];
    
    $query = "UPDATE maintenance SET status = :status, notes = :notes, updated_at = NOW() WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':notes', $notes);
    $stmt->bindParam(':id', $maintenance_id);
    
    if ($stmt->execute()) {
        $success_message = "Maintenance status updated successfully!";
    } else {
        $error_message = "Error updating maintenance status. Please try again.";
    }
}

// Handle search and filters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$plot_type_filter = isset($_GET['plot_type']) ? $_GET['plot_type'] : '';
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';

// Build query based on filters
$query = "
    SELECT 
        m.*,
        p.plot_number,
        pt.name as plot_type
    FROM maintenance m
    JOIN plots p ON m.plot_id = p.id
    JOIN plot_types pt ON p.plot_type_id = pt.id
    WHERE 1=1
";

$params = [];

if (!empty($search)) {
    $query .= " AND (p.plot_number LIKE :search OR m.performed_by LIKE :search OR m.description LIKE :search)";
    $params[':search'] = "%$search%";
}

if (!empty($plot_type_filter)) {
    $query .= " AND pt.name = :plot_type";
    $params[':plot_type'] = $plot_type_filter;
}

if (!empty($status_filter)) {
    $query .= " AND m.status = :status";
    $params[':status'] = $status_filter;
}

$query .= " ORDER BY m.start_date DESC";

$stmt = $db->prepare($query);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->execute();
$maintenance_records = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get plot types for filter
$plot_types_query = "SELECT DISTINCT name FROM plot_types ORDER BY name";
$plot_types_stmt = $db->prepare($plot_types_query);
$plot_types_stmt->execute();
$plot_types = $plot_types_stmt->fetchAll(PDO::FETCH_COLUMN);

// Get available plots for scheduling
$plots_query = "SELECT p.id, p.plot_number, pt.name as plot_type FROM plots p JOIN plot_types pt ON p.plot_type_id = pt.id ORDER BY p.plot_number";
$plots_stmt = $db->prepare($plots_query);
$plots_stmt->execute();
$available_plots = $plots_stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance - Cemetery Management System</title>
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
                <li><a href="inquiries.php"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="maintenance.php" class="active"><i class="fas fa-tools"></i> Maintenance</a></li>
                <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>Maintenance Management</h1>
                <p class="breadcrumb">Home > Maintenance</p>
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

            <!-- Maintenance Table -->
            <div class="table-container">
                <div class="table-header">
                    <h3 class="table-title"><i class="fas fa-tools"></i> Maintenance Schedule</h3>
                    <div class="table-controls">
                        <form method="GET" style="display: flex; gap: 1rem; align-items: center;">
                            <input type="text" name="search" class="search-box" placeholder="Search maintenance..." value="<?php echo htmlspecialchars($search); ?>">
                            
                            <select name="plot_type" class="filter-select">
                                <option value="">All Plot Types</option>
                                <?php foreach ($plot_types as $type): ?>
                                    <option value="<?php echo htmlspecialchars($type); ?>" <?php echo $plot_type_filter == $type ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($type); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            
                            <select name="status" class="filter-select">
                                <option value="">All Status</option>
                                <option value="scheduled" <?php echo $status_filter == 'scheduled' ? 'selected' : ''; ?>>Scheduled</option>
                                <option value="in_progress" <?php echo $status_filter == 'in_progress' ? 'selected' : ''; ?>>In Progress</option>
                                <option value="completed" <?php echo $status_filter == 'completed' ? 'selected' : ''; ?>>Completed</option>
                            </select>
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Search
                            </button>
                            
                            <button type="button" class="btn btn-primary" onclick="openScheduleModal()">
                                <i class="fas fa-plus"></i> Schedule Maintenance
                            </button>
                        </form>
                    </div>
                </div>
                
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Plot Number</th>
                                <th>Plot Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Performed By</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($maintenance_records)): ?>
                                <tr>
                                    <td colspan="8" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                                        No maintenance records found.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($maintenance_records as $record): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($record['plot_number']); ?></td>
                                        <td><?php echo htmlspecialchars($record['plot_type']); ?></td>
                                        <td><?php echo date('M j, Y', strtotime($record['start_date'])); ?></td>
                                        <td><?php echo $record['end_date'] ? date('M j, Y', strtotime($record['end_date'])) : 'N/A'; ?></td>
                                        <td><?php echo htmlspecialchars($record['performed_by']); ?></td>
                                        <td>
                                            <span class="status-badge <?php 
                                                echo $record['status'] == 'completed' ? 'status-active' : 
                                                    ($record['status'] == 'in_progress' ? 'status-pending' : 'status-inactive'); 
                                            ?>">
                                                <?php echo ucwords(str_replace('_', ' ', $record['status'])); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <?php if (strlen($record['description']) > 50): ?>
                                                <?php echo htmlspecialchars(substr($record['description'], 0, 50) . '...'); ?>
                                            <?php else: ?>
                                                <?php echo htmlspecialchars($record['description']); ?>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="viewHistory(<?php echo $record['id']; ?>)">
                                                <i class="fas fa-history"></i> History
                                            </button>
                                            <?php if ($_SESSION['user_type'] == 'admin' || $record['status'] != 'completed'): ?>
                                                <button class="btn btn-secondary btn-sm" onclick="updateMaintenance(<?php echo $record['id']; ?>)">
                                                    <i class="fas fa-edit"></i> Update
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

    <!-- Schedule Maintenance Modal -->
    <div id="scheduleModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeScheduleModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-calendar-plus"></i> Schedule Maintenance
            </h2>
            <form method="POST">
                <div class="form-group">
                    <label for="plot_id">Plot</label>
                    <select id="plot_id" name="plot_id" class="filter-select" style="width: 100%;" required>
                        <option value="">Select Plot</option>
                        <?php foreach ($available_plots as $plot): ?>
                            <option value="<?php echo $plot['id']; ?>">
                                <?php echo htmlspecialchars($plot['plot_number'] . ' - ' . $plot['plot_type']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="start_date">Start Date</label>
                    <input type="date" id="start_date" name="start_date" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="end_date">End Date (Optional)</label>
                    <input type="date" id="end_date" name="end_date" class="form-control">
                </div>
                <div class="form-group">
                    <label for="performed_by">Performed By</label>
                    <input type="text" id="performed_by" name="performed_by" class="form-control" required placeholder="Enter name or team">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;" placeholder="Describe the maintenance work to be performed"></textarea>
                </div>
                <button type="submit" name="schedule_maintenance" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-calendar-check"></i> Schedule Maintenance
                </button>
            </form>
        </div>
    </div>

    <!-- Update Maintenance Modal -->
    <div id="updateModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeUpdateModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-edit"></i> Update Maintenance
            </h2>
            <form method="POST">
                <input type="hidden" name="maintenance_id" id="update_maintenance_id">
                <div id="maintenanceInfo" style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <!-- Maintenance info will be loaded here -->
                </div>
                <div class="form-group">
                    <label for="update_status">Status</label>
                    <select id="update_status" name="status" class="filter-select" style="width: 100%;" required>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="update_notes">Notes</label>
                    <textarea id="update_notes" name="notes" rows="4" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;" placeholder="Add notes about the maintenance work"></textarea>
                </div>
                <button type="submit" name="update_status" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-save"></i> Update Status
                </button>
            </form>
        </div>
    </div>

    <!-- View History Modal -->
    <div id="historyModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeHistoryModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-history"></i> Maintenance History
            </h2>
            <div id="historyDetails">
                <!-- History details will be loaded here -->
            </div>
        </div>
    </div>

    <script>
        // Maintenance data for JavaScript
        const maintenanceData = <?php echo json_encode($maintenance_records); ?>;

        function openScheduleModal() {
            document.getElementById('scheduleModal').style.display = 'block';
        }

        function closeScheduleModal() {
            document.getElementById('scheduleModal').style.display = 'none';
        }

        function updateMaintenance(maintenanceId) {
            const maintenance = maintenanceData.find(m => m.id == maintenanceId);
            if (maintenance) {
                document.getElementById('update_maintenance_id').value = maintenanceId;
                document.getElementById('update_status').value = maintenance.status;
                document.getElementById('update_notes').value = maintenance.notes || '';
                
                document.getElementById('maintenanceInfo').innerHTML = `
                    <strong>Plot:</strong> ${maintenance.plot_number}<br>
                    <strong>Type:</strong> ${maintenance.plot_type}<br>
                    <strong>Performed By:</strong> ${maintenance.performed_by}<br>
                    <strong>Start Date:</strong> ${new Date(maintenance.start_date).toLocaleDateString()}<br>
                    <strong>Description:</strong> ${maintenance.description || 'N/A'}
                `;
                
                document.getElementById('updateModal').style.display = 'block';
            }
        }

        function closeUpdateModal() {
            document.getElementById('updateModal').style.display = 'none';
        }

        function viewHistory(maintenanceId) {
            const maintenance = maintenanceData.find(m => m.id == maintenanceId);
            if (maintenance) {
                document.getElementById('historyDetails').innerHTML = `
                    <div style="padding: 1rem;">
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>Basic Information</h4>
                            <p><strong>Plot:</strong> ${maintenance.plot_number} (${maintenance.plot_type})</p>
                            <p><strong>Performed By:</strong> ${maintenance.performed_by}</p>
                            <p><strong>Start Date:</strong> ${new Date(maintenance.start_date).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> ${maintenance.end_date ? new Date(maintenance.end_date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Current Status:</strong> <span class="status-badge">${maintenance.status.replace('_', ' ')}</span></p>
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>Description</h4>
                            <p>${maintenance.description || 'No description provided'}</p>
                        </div>
                        ${maintenance.notes ? `
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
                                <h4>Notes</h4>
                                <p>${maintenance.notes}</p>
                            </div>
                        ` : ''}
                        <div style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                            <p><strong>Created:</strong> ${new Date(maintenance.created_at).toLocaleString()}</p>
                            <p><strong>Last Updated:</strong> ${new Date(maintenance.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                `;
                document.getElementById('historyModal').style.display = 'block';
            }
        }

        function closeHistoryModal() {
            document.getElementById('historyModal').style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const scheduleModal = document.getElementById('scheduleModal');
            const updateModal = document.getElementById('updateModal');
            const historyModal = document.getElementById('historyModal');
            
            if (event.target == scheduleModal) {
                closeScheduleModal();
            }
            if (event.target == updateModal) {
                closeUpdateModal();
            }
            if (event.target == historyModal) {
                closeHistoryModal();
            }
        }

        // Set minimum date to today
        document.getElementById('start_date').min = new Date().toISOString().split('T')[0];
        document.getElementById('end_date').min = new Date().toISOString().split('T')[0];
    </script>
</body>
</html>