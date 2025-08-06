<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);

$database = new Database();
$db = $database->getConnection();

// Handle tab switching
$active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'purchases';

// Handle search and filters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$plot_type_filter = isset($_GET['plot_type']) ? $_GET['plot_type'] : '';

if ($active_tab == 'purchases') {
    // Plot purchases query
    $query = "
        SELECT 
            pp.*,
            p.plot_number,
            pt.name as plot_type,
            CONCAT(u.first_name, ' ', u.last_name) as client_name,
            u.address,
            u.phone as contact_number,
            u.email
        FROM plot_purchases pp
        JOIN plots p ON pp.plot_id = p.id
        JOIN plot_types pt ON p.plot_type_id = pt.id
        JOIN users u ON pp.client_id = u.id
        WHERE 1=1
    ";
    
    $params = [];
    
    if (!empty($search)) {
        $query .= " AND (p.plot_number LIKE :search OR CONCAT(u.first_name, ' ', u.last_name) LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($plot_type_filter)) {
        $query .= " AND pt.name = :plot_type";
        $params[':plot_type'] = $plot_type_filter;
    }
    
    $query .= " ORDER BY pp.created_at DESC";
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $purchases = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    // Rental niches query
    $query = "
        SELECT 
            rn.*,
            CONCAT(u.first_name, ' ', u.last_name) as client_name,
            u.address,
            u.phone as contact_number,
            u.email
        FROM rental_niches rn
        JOIN users u ON rn.client_id = u.id
        WHERE 1=1
    ";
    
    $params = [];
    
    if (!empty($search)) {
        $query .= " AND (rn.niche_number LIKE :search OR CONCAT(u.first_name, ' ', u.last_name) LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    $query .= " ORDER BY rn.created_at DESC";
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $niches = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

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
    <title>Amortization - Cemetery Management System</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .tab-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .tab-header {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        .tab-button {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            color: #7f8c8d;
            transition: all 0.3s ease;
        }
        .tab-button.active {
            background: white;
            color: #2c3e50;
            border-bottom: 3px solid #e74c3c;
        }
        .tab-content {
            display: none;
            padding: 1.5rem;
        }
        .tab-content.active {
            display: block;
        }
    </style>
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
                <li><a href="amortization.php" class="active"><i class="fas fa-calculator"></i> Amortization</a></li>
                <li><a href="inquiries.php"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="maintenance.php"><i class="fas fa-tools"></i> Maintenance</a></li>
                <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>Amortization Management</h1>
                <p class="breadcrumb">Home > Amortization</p>
            </div>

            <!-- Tab Container -->
            <div class="tab-container">
                <div class="tab-header">
                    <button class="tab-button <?php echo $active_tab == 'purchases' ? 'active' : ''; ?>" onclick="switchTab('purchases')">
                        <i class="fas fa-home"></i> Plot Purchases
                    </button>
                    <button class="tab-button <?php echo $active_tab == 'niches' ? 'active' : ''; ?>" onclick="switchTab('niches')">
                        <i class="fas fa-building"></i> Rental Apartment Niches
                    </button>
                </div>

                <!-- Plot Purchases Tab -->
                <div id="purchases-tab" class="tab-content <?php echo $active_tab == 'purchases' ? 'active' : ''; ?>">
                    <div class="table-container" style="box-shadow: none; margin: 0;">
                        <div class="table-header">
                            <h3 class="table-title"><i class="fas fa-calculator"></i> Plot Purchase Amortization</h3>
                            <div class="table-controls">
                                <form method="GET" style="display: flex; gap: 1rem; align-items: center;">
                                    <input type="hidden" name="tab" value="purchases">
                                    <input type="text" name="search" class="search-box" placeholder="Search..." value="<?php echo htmlspecialchars($search); ?>">
                                    
                                    <select name="plot_type" class="filter-select">
                                        <option value="">All Plot Types</option>
                                        <?php foreach ($plot_types as $type): ?>
                                            <option value="<?php echo htmlspecialchars($type); ?>" <?php echo $plot_type_filter == $type ? 'selected' : ''; ?>>
                                                <?php echo htmlspecialchars($type); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-search"></i> Search
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <div style="overflow-x: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Plot Number</th>
                                        <th>Client Name</th>
                                        <th>Address</th>
                                        <th>Contact</th>
                                        <th>Email</th>
                                        <th>Payment Mode</th>
                                        <th>Terms</th>
                                        <th>Monthly Amount</th>
                                        <th>First Payment</th>
                                        <th>Last Payment</th>
                                        <th>Outstanding</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if ($active_tab == 'purchases' && empty($purchases)): ?>
                                        <tr>
                                            <td colspan="12" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                                                No plot purchase records found.
                                            </td>
                                        </tr>
                                    <?php elseif ($active_tab == 'purchases'): ?>
                                        <?php foreach ($purchases as $purchase): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($purchase['plot_number']); ?></td>
                                                <td><?php echo htmlspecialchars($purchase['client_name']); ?></td>
                                                <td><?php echo htmlspecialchars($purchase['address']); ?></td>
                                                <td><?php echo htmlspecialchars($purchase['contact_number']); ?></td>
                                                <td><?php echo htmlspecialchars($purchase['email']); ?></td>
                                                <td>
                                                    <?php 
                                                    $mode_labels = [
                                                        'spot_cash' => 'Spot Cash',
                                                        'straight_payment' => 'Straight Payment',
                                                        'downpayment' => 'Downpayment'
                                                    ];
                                                    echo $mode_labels[$purchase['payment_mode']] ?? $purchase['payment_mode'];
                                                    ?>
                                                </td>
                                                <td><?php echo $purchase['payment_terms'] ? $purchase['payment_terms'] . ' years' : 'N/A'; ?></td>
                                                <td>₱<?php echo number_format($purchase['monthly_amortization'] ?? 0, 2); ?></td>
                                                <td><?php echo $purchase['first_payment_date'] ? date('M j, Y', strtotime($purchase['first_payment_date'])) : 'N/A'; ?></td>
                                                <td><?php echo $purchase['last_payment_date'] ? date('M j, Y', strtotime($purchase['last_payment_date'])) : 'N/A'; ?></td>
                                                <td>₱<?php echo number_format($purchase['outstanding_balance'], 2); ?></td>
                                                <td>
                                                    <span class="status-badge <?php 
                                                        echo $purchase['status'] == 'completed' ? 'status-active' : 
                                                            ($purchase['status'] == 'defaulted' ? 'status-inactive' : 'status-pending'); 
                                                    ?>">
                                                        <?php echo ucfirst($purchase['status']); ?>
                                                    </span>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Rental Niches Tab -->
                <div id="niches-tab" class="tab-content <?php echo $active_tab == 'niches' ? 'active' : ''; ?>">
                    <div class="table-container" style="box-shadow: none; margin: 0;">
                        <div class="table-header">
                            <h3 class="table-title"><i class="fas fa-building"></i> Rental Apartment Niches</h3>
                            <div class="table-controls">
                                <form method="GET" style="display: flex; gap: 1rem; align-items: center;">
                                    <input type="hidden" name="tab" value="niches">
                                    <input type="text" name="search" class="search-box" placeholder="Search..." value="<?php echo htmlspecialchars($search); ?>">
                                    
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-search"></i> Search
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <div style="overflow-x: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Niche No.</th>
                                        <th>Client Name</th>
                                        <th>Address</th>
                                        <th>Contact</th>
                                        <th>Email</th>
                                        <th>Contract Start</th>
                                        <th>Contract End</th>
                                        <th>Rental Fee</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if ($active_tab == 'niches' && empty($niches)): ?>
                                        <tr>
                                            <td colspan="10" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                                                No rental niche records found.
                                            </td>
                                        </tr>
                                    <?php elseif ($active_tab == 'niches'): ?>
                                        <?php foreach ($niches as $niche): ?>
                                            <?php
                                            $today = date('Y-m-d');
                                            $contract_end = $niche['contract_end'];
                                            $is_expired = $contract_end < $today;
                                            $days_until_expiry = floor((strtotime($contract_end) - strtotime($today)) / (60 * 60 * 24));
                                            ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($niche['niche_number']); ?></td>
                                                <td><?php echo htmlspecialchars($niche['client_name']); ?></td>
                                                <td><?php echo htmlspecialchars($niche['address']); ?></td>
                                                <td><?php echo htmlspecialchars($niche['contact_number']); ?></td>
                                                <td><?php echo htmlspecialchars($niche['email']); ?></td>
                                                <td><?php echo date('M j, Y', strtotime($niche['contract_start'])); ?></td>
                                                <td><?php echo date('M j, Y', strtotime($niche['contract_end'])); ?></td>
                                                <td>₱<?php echo number_format($niche['rental_fee'], 2); ?></td>
                                                <td>
                                                    <span class="status-badge <?php 
                                                        echo $niche['status'] == 'active' ? 'status-active' : 
                                                            ($niche['status'] == 'expired' ? 'status-inactive' : 'status-pending'); 
                                                    ?>">
                                                        <?php echo ucfirst($niche['status']); ?>
                                                    </span>
                                                    <?php if ($is_expired): ?>
                                                        <br><small style="color: #e74c3c;">Expired</small>
                                                    <?php elseif ($days_until_expiry <= 30): ?>
                                                        <br><small style="color: #f39c12;">Expires in <?php echo $days_until_expiry; ?> days</small>
                                                    <?php endif; ?>
                                                </td>
                                                <td>
                                                    <button class="btn btn-primary btn-sm" onclick="viewNiche(<?php echo $niche['id']; ?>)">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <?php if ($is_expired || $days_until_expiry <= 30): ?>
                                                        <button class="btn btn-secondary btn-sm" onclick="renewContract(<?php echo $niche['id']; ?>)">
                                                            <i class="fas fa-redo"></i> Renew
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
                </div>
            </div>
        </main>
    </div>

    <script>
        function switchTab(tabName) {
            window.location.href = 'amortization.php?tab=' + tabName;
        }

        function viewNiche(nicheId) {
            alert('View niche details for ID: ' + nicheId);
        }

        function renewContract(nicheId) {
            if (confirm('Are you sure you want to renew this contract?')) {
                alert('Contract renewal functionality would be implemented here for niche ID: ' + nicheId);
            }
        }
    </script>
</body>
</html>