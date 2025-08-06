<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is admin
$auth->requireAdmin();

$currentUser = $auth->getCurrentUser();
$plotTypes = $functions->getPlotTypes();

// Handle search and filters
$search = $_GET['search'] ?? '';
$plot_type_filter = $_GET['plot_type'] ?? '';
$burial_type_filter = $_GET['burial_type'] ?? '';

// Build query
$query = "SELECT g.*, pt.name as plot_type_name, b.*, u.first_name, u.last_name 
          FROM graves g 
          LEFT JOIN plot_types pt ON g.plot_type_id = pt.id 
          LEFT JOIN burials b ON g.id = b.grave_id 
          LEFT JOIN users u ON g.owner_id = u.id 
          WHERE 1=1";
$params = [];

if (!empty($search)) {
    $query .= " AND (g.plot_number LIKE ? OR b.deceased_name LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
    $searchTerm = "%{$search}%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
}

if (!empty($plot_type_filter)) {
    $query .= " AND g.plot_type_id = ?";
    $params[] = $plot_type_filter;
}

if (!empty($burial_type_filter)) {
    $query .= " AND b.burial_type = ?";
    $params[] = $burial_type_filter;
}

$query .= " ORDER BY g.plot_number";

try {
    $db = new Database();
    $stmt = $db->query($query, $params);
    $graves = $stmt->fetchAll();
} catch (Exception $e) {
    $graves = [];
    $error = "Error loading grave data: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grave Management - Sanctuario Admin</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h4><i class="fas fa-cross mr-2"></i>Sanctuario Admin</h4>
            <p class="mb-0">Welcome, <?php echo htmlspecialchars($currentUser['first_name']); ?></p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="dashboard.php"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
            <li><a href="map.php"><i class="fas fa-map"></i>Map</a></li>
            <li><a href="grave-management.php" class="active"><i class="fas fa-cross"></i>Grave Management</a></li>
            <li><a href="amortization.php"><i class="fas fa-credit-card"></i>Amortization</a></li>
            <li><a href="inquiries.php"><i class="fas fa-envelope"></i>Inquiries</a></li>
            <li><a href="maintenance.php"><i class="fas fa-tools"></i>Maintenance</a></li>
            <li><a href="settings.php"><i class="fas fa-cog"></i>Settings</a></li>
            <li><a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1>Grave Management</h1>
                <p class="text-muted">Manage cemetery plots and burial records</p>
            </div>
            <div>
                <button class="btn btn-success" onclick="openModal('addGraveModal')">
                    <i class="fas fa-plus mr-2"></i>Add New Grave
                </button>
                <button class="btn btn-primary" onclick="openModal('addBurialModal')">
                    <i class="fas fa-user-plus mr-2"></i>Add Burial
                </button>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <!-- Search and Filters -->
        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row align-items-end">
                    <div class="col-md-4">
                        <label class="form-label">Search</label>
                        <input type="text" name="search" class="form-control" 
                               placeholder="Plot number, deceased name, owner..."
                               value="<?php echo htmlspecialchars($search); ?>">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Plot Type</label>
                        <select name="plot_type" class="form-control form-select">
                            <option value="">All Plot Types</option>
                            <?php foreach ($plotTypes as $type): ?>
                                <option value="<?php echo $type['id']; ?>" 
                                        <?php echo $plot_type_filter == $type['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($type['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Burial Type</label>
                        <select name="burial_type" class="form-control form-select">
                            <option value="">All Types</option>
                            <option value="fresh_body" <?php echo $burial_type_filter === 'fresh_body' ? 'selected' : ''; ?>>Fresh Body</option>
                            <option value="bones" <?php echo $burial_type_filter === 'bones' ? 'selected' : ''; ?>>Bones</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Graves Table -->
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th class="sortable">Plot Number</th>
                        <th class="sortable">Deceased Name</th>
                        <th>Owner</th>
                        <th class="sortable">Date of Birth</th>
                        <th class="sortable">Date of Death</th>
                        <th class="sortable">Date of Interment</th>
                        <th>Plot Type</th>
                        <th>Burial Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($graves)): ?>
                        <tr>
                            <td colspan="9" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-3x mb-3"></i><br>
                                No burial records found
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($graves as $grave): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($grave['plot_number']); ?></strong></td>
                            <td>
                                <?php if ($grave['deceased_name']): ?>
                                    <?php echo htmlspecialchars($grave['deceased_name']); ?>
                                <?php else: ?>
                                    <span class="text-muted">Available</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($grave['first_name']): ?>
                                    <?php echo htmlspecialchars($grave['first_name'] . ' ' . $grave['last_name']); ?>
                                <?php else: ?>
                                    <span class="text-muted">No owner</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php echo $grave['date_of_birth'] ? $functions->formatDate($grave['date_of_birth']) : '-'; ?>
                            </td>
                            <td>
                                <?php echo $grave['date_of_death'] ? $functions->formatDate($grave['date_of_death']) : '-'; ?>
                            </td>
                            <td>
                                <?php echo $grave['date_of_interment'] ? $functions->formatDate($grave['date_of_interment']) : '-'; ?>
                            </td>
                            <td>
                                <span class="badge badge-info">
                                    <?php echo htmlspecialchars($grave['plot_type_name']); ?>
                                </span>
                            </td>
                            <td>
                                <?php if ($grave['burial_type']): ?>
                                    <span class="badge badge-<?php echo $grave['burial_type'] === 'fresh_body' ? 'success' : 'warning'; ?>">
                                        <?php echo $grave['burial_type'] === 'fresh_body' ? 'Fresh Body' : 'Bones'; ?>
                                    </span>
                                <?php else: ?>
                                    <span class="badge badge-secondary">Available</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewGrave(<?php echo $grave['id']; ?>)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="editGrave(<?php echo $grave['id']; ?>)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <?php if (!$grave['deceased_name']): ?>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteGrave(<?php echo $grave['id']; ?>)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add Grave Modal -->
    <div id="addGraveModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h5><i class="fas fa-plus mr-2"></i>Add New Grave Plot</h5>
                <button type="button" onclick="closeModal('addGraveModal')" class="btn-close">&times;</button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" name="action" value="add_grave">
                    <div class="form-group">
                        <label class="form-label">Plot Type</label>
                        <select name="plot_type_id" class="form-control form-select" required>
                            <option value="">Select Plot Type</option>
                            <?php foreach ($plotTypes as $type): ?>
                                <option value="<?php echo $type['id']; ?>">
                                    <?php echo htmlspecialchars($type['name']); ?> - <?php echo $functions->formatCurrency($type['price']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Plot Number</label>
                        <input type="text" name="plot_number" class="form-control" required 
                               placeholder="Will be auto-generated if left empty">
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Location X (Optional)</label>
                                <input type="number" name="location_x" class="form-control" step="0.000001">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Location Y (Optional)</label>
                                <input type="number" name="location_y" class="form-control" step="0.000001">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('addGraveModal')">Cancel</button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-plus mr-2"></i>Add Grave
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Burial Modal -->
    <div id="addBurialModal" class="modal">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h5><i class="fas fa-user-plus mr-2"></i>Add New Burial</h5>
                <button type="button" onclick="closeModal('addBurialModal')" class="btn-close">&times;</button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" name="action" value="add_burial">
                    <div class="form-group">
                        <label class="form-label">Select Grave Plot</label>
                        <select name="grave_id" class="form-control form-select" required>
                            <option value="">Select Available Plot</option>
                            <!-- Will be populated by JavaScript -->
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="form-label">Deceased Name</label>
                                <input type="text" name="deceased_name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="form-label">Burial Type</label>
                                <select name="burial_type" class="form-control form-select" required>
                                    <option value="">Select Type</option>
                                    <option value="fresh_body">Fresh Body</option>
                                    <option value="bones">Bones</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Date of Birth</label>
                                <input type="date" name="date_of_birth" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Date of Death</label>
                                <input type="date" name="date_of_death" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Date of Interment</label>
                                <input type="date" name="date_of_interment" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Relationship to Owner</label>
                        <input type="text" name="relationship_to_owner" class="form-control" 
                               placeholder="e.g., Self, Spouse, Child, Parent">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notes (Optional)</label>
                        <textarea name="notes" class="form-control" rows="3" 
                                  placeholder="Additional information about the burial"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('addBurialModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-user-plus mr-2"></i>Add Burial
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>
    <script>
        function viewGrave(id) {
            // Implement view grave details
            showNotification('View grave details - Feature to be implemented', 'info');
        }

        function editGrave(id) {
            // Implement edit grave
            showNotification('Edit grave - Feature to be implemented', 'info');
        }

        function deleteGrave(id) {
            if (confirm('Are you sure you want to delete this grave plot?')) {
                // Implement delete grave
                showNotification('Delete grave - Feature to be implemented', 'info');
            }
        }

        // Load available plots when burial modal opens
        document.addEventListener('DOMContentLoaded', function() {
            // This would be populated from PHP/AJAX call
            // For now, showing placeholder
        });
    </script>
</body>
</html>