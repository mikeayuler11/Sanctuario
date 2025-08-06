<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);

$database = new Database();
$db = $database->getConnection();

// Handle search and filters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$plot_type_filter = isset($_GET['plot_type']) ? $_GET['plot_type'] : '';
$burial_type_filter = isset($_GET['burial_type']) ? $_GET['burial_type'] : '';

// Build query based on filters
$query = "
    SELECT 
        b.id,
        p.plot_number,
        b.deceased_name,
        pp.client_id,
        CONCAT(u.first_name, ' ', u.last_name) as owner_name,
        u.address as owner_address,
        b.date_of_birth,
        b.date_of_death,
        b.date_of_interment,
        pt.name as plot_type,
        b.burial_type,
        p.status as plot_status
    FROM burials b
    JOIN plots p ON b.plot_id = p.id
    JOIN plot_types pt ON p.plot_type_id = pt.id
    LEFT JOIN plot_purchases pp ON p.id = pp.plot_id
    LEFT JOIN users u ON pp.client_id = u.id
    WHERE 1=1
";

$params = [];

if (!empty($search)) {
    $query .= " AND (b.deceased_name LIKE :search OR p.plot_number LIKE :search OR CONCAT(u.first_name, ' ', u.last_name) LIKE :search)";
    $params[':search'] = "%$search%";
}

if (!empty($plot_type_filter)) {
    $query .= " AND pt.name = :plot_type";
    $params[':plot_type'] = $plot_type_filter;
}

if (!empty($burial_type_filter)) {
    $query .= " AND b.burial_type = :burial_type";
    $params[':burial_type'] = $burial_type_filter;
}

$query .= " ORDER BY b.created_at DESC";

$stmt = $db->prepare($query);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->execute();
$burials = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get plot types for filter
$plot_types_query = "SELECT DISTINCT name FROM plot_types ORDER BY name";
$plot_types_stmt = $db->prepare($plot_types_query);
$plot_types_stmt->execute();
$plot_types = $plot_types_stmt->fetchAll(PDO::FETCH_COLUMN);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grave Management - Cemetery Management System</title>
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
                <li><a href="grave_management.php" class="active"><i class="fas fa-bed"></i> Grave Management</a></li>
                <li><a href="amortization.php"><i class="fas fa-calculator"></i> Amortization</a></li>
                <li><a href="inquiries.php"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="maintenance.php"><i class="fas fa-tools"></i> Maintenance</a></li>
                <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>Grave Management</h1>
                <p class="breadcrumb">Home > Grave Management</p>
            </div>

            <!-- Graves Table -->
            <div class="table-container">
                <div class="table-header">
                    <h3 class="table-title"><i class="fas fa-bed"></i> Burial Records</h3>
                    <div class="table-controls">
                        <form method="GET" style="display: flex; gap: 1rem; align-items: center;">
                            <input type="text" name="search" class="search-box" placeholder="Search graves..." value="<?php echo htmlspecialchars($search); ?>">
                            
                            <select name="plot_type" class="filter-select">
                                <option value="">All Plot Types</option>
                                <?php foreach ($plot_types as $type): ?>
                                    <option value="<?php echo htmlspecialchars($type); ?>" <?php echo $plot_type_filter == $type ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($type); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            
                            <select name="burial_type" class="filter-select">
                                <option value="">All Burial Types</option>
                                <option value="fresh_body" <?php echo $burial_type_filter == 'fresh_body' ? 'selected' : ''; ?>>Fresh Body</option>
                                <option value="bones" <?php echo $burial_type_filter == 'bones' ? 'selected' : ''; ?>>Bones</option>
                            </select>
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Search
                            </button>
                            
                            <a href="grave_management.php" class="btn btn-secondary">
                                <i class="fas fa-refresh"></i> Reset
                            </a>
                        </form>
                    </div>
                </div>
                
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Plot Number</th>
                                <th>Deceased Name</th>
                                <th>Owner Name</th>
                                <th>Owner Address</th>
                                <th>Date of Birth</th>
                                <th>Date of Death</th>
                                <th>Date of Interment</th>
                                <th>Plot Type</th>
                                <th>Burial Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($burials)): ?>
                                <tr>
                                    <td colspan="10" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                                        No burial records found.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($burials as $burial): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($burial['plot_number']); ?></td>
                                        <td><?php echo htmlspecialchars($burial['deceased_name']); ?></td>
                                        <td><?php echo htmlspecialchars($burial['owner_name'] ?? 'N/A'); ?></td>
                                        <td><?php echo htmlspecialchars($burial['owner_address'] ?? 'N/A'); ?></td>
                                        <td><?php echo date('M j, Y', strtotime($burial['date_of_birth'])); ?></td>
                                        <td><?php echo date('M j, Y', strtotime($burial['date_of_death'])); ?></td>
                                        <td><?php echo date('M j, Y', strtotime($burial['date_of_interment'])); ?></td>
                                        <td><?php echo htmlspecialchars($burial['plot_type']); ?></td>
                                        <td>
                                            <span class="status-badge <?php echo $burial['burial_type'] == 'fresh_body' ? 'status-active' : 'status-pending'; ?>">
                                                <?php echo $burial['burial_type'] == 'fresh_body' ? 'Fresh Body' : 'Bones'; ?>
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="viewBurial(<?php echo $burial['id']; ?>)">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <?php if ($_SESSION['user_type'] == 'admin'): ?>
                                                <button class="btn btn-secondary btn-sm" onclick="editBurial(<?php echo $burial['id']; ?>)">
                                                    <i class="fas fa-edit"></i>
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

    <!-- View Burial Modal -->
    <div id="viewBurialModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeViewModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-bed"></i> Burial Details
            </h2>
            <div id="burialDetails">
                <!-- Burial details will be loaded here -->
            </div>
        </div>
    </div>

    <script>
        function viewBurial(burialId) {
            // In a real implementation, you would fetch burial details via AJAX
            // For now, we'll show a placeholder
            document.getElementById('burialDetails').innerHTML = `
                <div style="padding: 1rem;">
                    <p><strong>Plot Number:</strong> Loading...</p>
                    <p><strong>Deceased Name:</strong> Loading...</p>
                    <p><strong>Owner Information:</strong> Loading...</p>
                    <p><em>Detailed view would be implemented with AJAX call to fetch full burial information.</em></p>
                </div>
            `;
            document.getElementById('viewBurialModal').style.display = 'block';
        }

        function editBurial(burialId) {
            // In a real implementation, you would open an edit form
            alert('Edit functionality would be implemented here for burial ID: ' + burialId);
        }

        function closeViewModal() {
            document.getElementById('viewBurialModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('viewBurialModal');
            if (event.target == modal) {
                closeViewModal();
            }
        }
    </script>
</body>
</html>