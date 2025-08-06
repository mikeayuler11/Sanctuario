<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is admin
$auth->requireAdmin();

$currentUser = $auth->getCurrentUser();
$plotTypes = $functions->getPlotTypes();

// Handle tab switching
$activeTab = $_GET['tab'] ?? 'amortization';

// Handle search and filters for amortization
$search = $_GET['search'] ?? '';
$plot_type_filter = $_GET['plot_type'] ?? '';

// Build amortization query
$query = "SELECT a.*, g.plot_number, pt.name as plot_type_name, u.first_name, u.last_name, u.email, u.phone, u.address 
          FROM amortization a 
          JOIN graves g ON a.grave_id = g.id 
          JOIN plot_types pt ON g.plot_type_id = pt.id 
          JOIN users u ON a.client_id = u.id 
          WHERE 1=1";
$params = [];

if (!empty($search)) {
    $query .= " AND (g.plot_number LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
    $searchTerm = "%{$search}%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
}

if (!empty($plot_type_filter)) {
    $query .= " AND g.plot_type_id = ?";
    $params[] = $plot_type_filter;
}

$query .= " ORDER BY a.date_created DESC";

try {
    $db = new Database();
    $stmt = $db->query($query, $params);
    $amortizations = $stmt->fetchAll();
} catch (Exception $e) {
    $amortizations = [];
    $error = "Error loading amortization data: " . $e->getMessage();
}

// Get rental niches
try {
    $rentalQuery = "SELECT rn.*, u.first_name, u.last_name, u.email, u.phone, u.address 
                    FROM rental_niches rn 
                    JOIN users u ON rn.client_id = u.id 
                    ORDER BY rn.date_created DESC";
    $stmt = $db->query($rentalQuery);
    $rentals = $stmt->fetchAll();
} catch (Exception $e) {
    $rentals = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amortization Management - Sanctuario Admin</title>
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
            <li><a href="grave-management.php"><i class="fas fa-cross"></i>Grave Management</a></li>
            <li><a href="amortization.php" class="active"><i class="fas fa-credit-card"></i>Amortization</a></li>
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
                <h1>Amortization Management</h1>
                <p class="text-muted">Manage payment plans and rental agreements</p>
            </div>
            <div>
                <button class="btn btn-success" onclick="openModal('addAmortizationModal')">
                    <i class="fas fa-plus mr-2"></i>Add Payment Plan
                </button>
                <button class="btn btn-primary" onclick="openModal('addRentalModal')">
                    <i class="fas fa-home mr-2"></i>Add Rental
                </button>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <!-- Tab Navigation -->
        <div class="card mb-4">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item">
                        <a class="nav-link <?php echo $activeTab === 'amortization' ? 'active' : ''; ?>" 
                           href="?tab=amortization">
                            <i class="fas fa-credit-card mr-2"></i>Amortization Plans
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $activeTab === 'rental' ? 'active' : ''; ?>" 
                           href="?tab=rental">
                            <i class="fas fa-home mr-2"></i>Rental Apartment Niches
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <?php if ($activeTab === 'amortization'): ?>
        <!-- Amortization Tab -->
        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row align-items-end">
                    <input type="hidden" name="tab" value="amortization">
                    <div class="col-md-5">
                        <label class="form-label">Search</label>
                        <input type="text" name="search" class="form-control" 
                               placeholder="Plot number, client name..."
                               value="<?php echo htmlspecialchars($search); ?>">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Plot Type</label>
                        <select name="plot_type" class="form-control form-select">
                            <option value="">All Plot Types</option>
                            <?php foreach ($plotTypes as $type): ?>
                                <?php if ($type['name'] !== 'Rental Apartment Niche'): ?>
                                <option value="<?php echo $type['id']; ?>" 
                                        <?php echo $plot_type_filter == $type['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($type['name']); ?>
                                </option>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Plot Number</th>
                        <th>Client Name</th>
                        <th>Contact</th>
                        <th>Mode of Payment</th>
                        <th>Terms</th>
                        <th>Monthly Payment</th>
                        <th>First Payment</th>
                        <th>Last Payment</th>
                        <th>Outstanding Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($amortizations)): ?>
                        <tr>
                            <td colspan="11" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-3x mb-3"></i><br>
                                No amortization records found
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($amortizations as $amort): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($amort['plot_number']); ?></strong></td>
                            <td><?php echo htmlspecialchars($amort['first_name'] . ' ' . $amort['last_name']); ?></td>
                            <td>
                                <small>
                                    <?php echo htmlspecialchars($amort['phone']); ?><br>
                                    <?php echo htmlspecialchars($amort['email']); ?>
                                </small>
                            </td>
                            <td>
                                <span class="badge badge-info">
                                    <?php 
                                    switch($amort['mode_of_payment']) {
                                        case 'spot_cash': echo 'Spot Cash'; break;
                                        case 'straight_payment': echo 'Straight Payment'; break;
                                        case 'downpayment': echo 'Downpayment'; break;
                                        default: echo $amort['mode_of_payment'];
                                    }
                                    ?>
                                </span>
                            </td>
                            <td><?php echo $amort['terms']; ?> year<?php echo $amort['terms'] > 1 ? 's' : ''; ?></td>
                            <td><?php echo $functions->formatCurrency($amort['monthly_payment']); ?></td>
                            <td><?php echo $functions->formatDate($amort['first_payment_date']); ?></td>
                            <td><?php echo $functions->formatDate($amort['last_payment_date']); ?></td>
                            <td class="<?php echo $amort['outstanding_balance'] > 0 ? 'text-danger' : 'text-success'; ?>">
                                <?php echo $functions->formatCurrency($amort['outstanding_balance']); ?>
                            </td>
                            <td>
                                <span class="badge badge-<?php 
                                    switch($amort['status']) {
                                        case 'active': echo 'success'; break;
                                        case 'completed': echo 'info'; break;
                                        case 'overdue': echo 'danger'; break;
                                        case 'cancelled': echo 'secondary'; break;
                                        default: echo 'secondary';
                                    }
                                ?>">
                                    <?php echo ucfirst($amort['status']); ?>
                                </span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewPayments(<?php echo $amort['id']; ?>)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-success" onclick="addPayment(<?php echo $amort['id']; ?>)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="editAmortization(<?php echo $amort['id']; ?>)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php else: ?>
        <!-- Rental Niches Tab -->
        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row align-items-end">
                    <input type="hidden" name="tab" value="rental">
                    <div class="col-md-8">
                        <label class="form-label">Search</label>
                        <input type="text" name="search" class="form-control" 
                               placeholder="Niche number, client name..."
                               value="<?php echo htmlspecialchars($search); ?>">
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Niche No.</th>
                        <th>Client Name</th>
                        <th>Contact</th>
                        <th>Contract Start</th>
                        <th>Contract End</th>
                        <th>Rental Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($rentals)): ?>
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-3x mb-3"></i><br>
                                No rental records found
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($rentals as $rental): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($rental['niche_number']); ?></strong></td>
                            <td><?php echo htmlspecialchars($rental['first_name'] . ' ' . $rental['last_name']); ?></td>
                            <td>
                                <small>
                                    <?php echo htmlspecialchars($rental['phone']); ?><br>
                                    <?php echo htmlspecialchars($rental['email']); ?>
                                </small>
                            </td>
                            <td><?php echo $functions->formatDate($rental['contract_start']); ?></td>
                            <td><?php echo $functions->formatDate($rental['contract_end']); ?></td>
                            <td><?php echo $functions->formatCurrency($rental['rental_amount']); ?></td>
                            <td>
                                <span class="badge badge-<?php 
                                    switch($rental['status']) {
                                        case 'active': echo 'success'; break;
                                        case 'inactive': echo 'warning'; break;
                                        case 'expired': echo 'danger'; break;
                                        default: echo 'secondary';
                                    }
                                ?>">
                                    <?php echo ucfirst($rental['status']); ?>
                                </span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewRental(<?php echo $rental['id']; ?>)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="editRental(<?php echo $rental['id']; ?>)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-success" onclick="renewRental(<?php echo $rental['id']; ?>)">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
    </div>

    <script src="../../assets/js/main.js"></script>
    <script>
        function viewPayments(id) {
            showNotification('View payment history - Feature to be implemented', 'info');
        }

        function addPayment(id) {
            showNotification('Add payment - Feature to be implemented', 'info');
        }

        function editAmortization(id) {
            showNotification('Edit amortization - Feature to be implemented', 'info');
        }

        function viewRental(id) {
            showNotification('View rental details - Feature to be implemented', 'info');
        }

        function editRental(id) {
            showNotification('Edit rental - Feature to be implemented', 'info');
        }

        function renewRental(id) {
            if (confirm('Are you sure you want to renew this rental contract?')) {
                showNotification('Renew rental - Feature to be implemented', 'info');
            }
        }
    </script>

    <style>
        .nav-tabs .nav-link {
            border: none;
            color: var(--gray-600);
        }
        
        .nav-tabs .nav-link.active {
            background: var(--gradient-primary);
            color: white;
            border-radius: var(--border-radius);
        }
        
        .nav-tabs .nav-link:hover {
            border: none;
            background: rgba(52, 152, 219, 0.1);
        }
    </style>
</body>
</html>