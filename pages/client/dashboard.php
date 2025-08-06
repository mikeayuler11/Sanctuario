<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is client
$auth->requireLogin();
if ($auth->getUserType() !== 'client') {
    header('Location: ../../unauthorized.php');
    exit();
}

$currentUser = $auth->getCurrentUser();

// Get client's graves
try {
    $db = new Database();
    $stmt = $db->query(
        "SELECT g.*, pt.name as plot_type_name, pt.area, pt.price, 
                COUNT(b.id) as burial_count,
                GROUP_CONCAT(b.deceased_name SEPARATOR ', ') as deceased_names
         FROM graves g 
         JOIN plot_types pt ON g.plot_type_id = pt.id 
         LEFT JOIN burials b ON g.id = b.grave_id 
         WHERE g.owner_id = ? 
         GROUP BY g.id 
         ORDER BY g.plot_number",
        [$currentUser['id']]
    );
    $clientGraves = $stmt->fetchAll();
} catch (Exception $e) {
    $clientGraves = [];
}

// Get client's amortization records
try {
    $stmt = $db->query(
        "SELECT a.*, g.plot_number, pt.name as plot_type_name 
         FROM amortization a 
         JOIN graves g ON a.grave_id = g.id 
         JOIN plot_types pt ON g.plot_type_id = pt.id 
         WHERE a.client_id = ? 
         ORDER BY a.date_created DESC",
        [$currentUser['id']]
    );
    $clientAmortizations = $stmt->fetchAll();
} catch (Exception $e) {
    $clientAmortizations = [];
}

// Get client's rental niches
try {
    $stmt = $db->query(
        "SELECT * FROM rental_niches WHERE client_id = ? ORDER BY date_created DESC",
        [$currentUser['id']]
    );
    $clientRentals = $stmt->fetchAll();
} catch (Exception $e) {
    $clientRentals = [];
}

// Calculate statistics
$totalGraves = count($clientGraves);
$totalBurials = array_sum(array_column($clientGraves, 'burial_count'));
$totalAmortizations = count($clientAmortizations);
$totalOutstanding = array_sum(array_column($clientAmortizations, 'outstanding_balance'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard - Sanctuario de Santa Rosa de Lima</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h4><i class="fas fa-cross mr-2"></i>Sanctuario Client</h4>
            <p class="mb-0">Welcome, <?php echo htmlspecialchars($currentUser['first_name']); ?></p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
            <li><a href="map.php"><i class="fas fa-map"></i>Map</a></li>
            <li><a href="my-graves.php"><i class="fas fa-cross"></i>My Graves</a></li>
            <li><a href="inquiries.php"><i class="fas fa-envelope"></i>Inquiries</a></li>
            <li><a href="profile.php"><i class="fas fa-user"></i>Profile</a></li>
            <li><a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1>My Dashboard</h1>
                <p class="text-muted">Welcome to your personal memorial management dashboard</p>
            </div>
            <div>
                <button class="btn btn-primary" onclick="openModal('inquiryModal')">
                    <i class="fas fa-envelope mr-2"></i>Send Inquiry
                </button>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid animate-fadeIn">
            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $totalGraves; ?></div>
                        <div class="stat-label">My Plots</div>
                        <small class="text-muted">Owned memorial plots</small>
                    </div>
                    <div class="text-primary">
                        <i class="fas fa-home fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $totalBurials; ?></div>
                        <div class="stat-label">Burials</div>
                        <small class="text-success">Loved ones at rest</small>
                    </div>
                    <div class="text-success">
                        <i class="fas fa-user-friends fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $totalAmortizations; ?></div>
                        <div class="stat-label">Payment Plans</div>
                        <small class="text-info">Active amortizations</small>
                    </div>
                    <div class="text-info">
                        <i class="fas fa-credit-card fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $functions->formatCurrency($totalOutstanding); ?></div>
                        <div class="stat-label">Outstanding Balance</div>
                        <small class="text-<?php echo $totalOutstanding > 0 ? 'warning' : 'success'; ?>">
                            <?php echo $totalOutstanding > 0 ? 'Pending payments' : 'All paid up'; ?>
                        </small>
                    </div>
                    <div class="text-<?php echo $totalOutstanding > 0 ? 'warning' : 'success'; ?>">
                        <i class="fas fa-money-bill-wave fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- My Graves Section -->
        <div class="row mb-4">
            <div class="col-md-8">
                <div class="card animate-slideInLeft">
                    <div class="card-header">
                        <h5><i class="fas fa-cross mr-2"></i>My Memorial Plots</h5>
                    </div>
                    <div class="card-body">
                        <?php if (empty($clientGraves)): ?>
                            <div class="text-center text-muted py-4">
                                <i class="fas fa-home fa-3x mb-3"></i>
                                <p>You don't have any memorial plots yet.</p>
                                <button class="btn btn-primary" onclick="openModal('inquiryModal')">
                                    <i class="fas fa-envelope mr-2"></i>Inquire About Plots
                                </button>
                            </div>
                        <?php else: ?>
                            <div class="row">
                                <?php foreach ($clientGraves as $grave): ?>
                                <div class="col-md-6 mb-3">
                                    <div class="card border">
                                        <div class="card-body">
                                            <h6 class="card-title">
                                                <i class="fas fa-map-marker-alt mr-2"></i>
                                                Plot <?php echo htmlspecialchars($grave['plot_number']); ?>
                                            </h6>
                                            <p class="card-text">
                                                <span class="badge badge-info mb-2">
                                                    <?php echo htmlspecialchars($grave['plot_type_name']); ?>
                                                </span><br>
                                                <small class="text-muted">
                                                    Area: <?php echo $grave['area']; ?> sq.m<br>
                                                    <?php if ($grave['burial_count'] > 0): ?>
                                                        <strong>Burials:</strong> <?php echo htmlspecialchars($grave['deceased_names']); ?>
                                                    <?php else: ?>
                                                        <em>Available for burial</em>
                                                    <?php endif; ?>
                                                </small>
                                            </p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="badge badge-<?php echo $grave['burial_count'] > 0 ? 'success' : 'secondary'; ?>">
                                                    <?php echo $grave['burial_count'] > 0 ? 'Occupied' : 'Available'; ?>
                                                </span>
                                                <a href="my-graves.php?plot=<?php echo $grave['id']; ?>" class="btn btn-sm btn-outline-primary">
                                                    <i class="fas fa-eye mr-1"></i>View Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="card-footer">
                        <a href="my-graves.php" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-cross mr-2"></i>View All My Plots
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card animate-slideInRight">
                    <div class="card-header">
                        <h5><i class="fas fa-credit-card mr-2"></i>Payment Status</h5>
                    </div>
                    <div class="card-body">
                        <?php if (empty($clientAmortizations)): ?>
                            <div class="text-center text-muted py-4">
                                <i class="fas fa-credit-card fa-2x mb-3"></i>
                                <p>No active payment plans</p>
                            </div>
                        <?php else: ?>
                            <?php foreach ($clientAmortizations as $amort): ?>
                            <div class="payment-item mb-3">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Plot <?php echo htmlspecialchars($amort['plot_number']); ?></h6>
                                        <p class="mb-1">
                                            <small class="text-muted">
                                                <?php echo htmlspecialchars($amort['plot_type_name']); ?>
                                            </small>
                                        </p>
                                        <div class="mb-2">
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
                                        </div>
                                    </div>
                                </div>
                                <div class="payment-details">
                                    <div class="d-flex justify-content-between">
                                        <small>Monthly Payment:</small>
                                        <small><strong><?php echo $functions->formatCurrency($amort['monthly_payment']); ?></strong></small>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <small>Outstanding:</small>
                                        <small class="<?php echo $amort['outstanding_balance'] > 0 ? 'text-danger' : 'text-success'; ?>">
                                            <strong><?php echo $functions->formatCurrency($amort['outstanding_balance']); ?></strong>
                                        </small>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <small>Next Due:</small>
                                        <small><?php echo $functions->formatDate($amort['last_payment_date']); ?></small>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Rental Niches -->
                <?php if (!empty($clientRentals)): ?>
                <div class="card mt-4 animate-slideInRight">
                    <div class="card-header">
                        <h5><i class="fas fa-home mr-2"></i>Rental Niches</h5>
                    </div>
                    <div class="card-body">
                        <?php foreach ($clientRentals as $rental): ?>
                        <div class="rental-item mb-3">
                            <h6 class="mb-1">Niche <?php echo htmlspecialchars($rental['niche_number']); ?></h6>
                            <div class="d-flex justify-content-between">
                                <small>Contract End:</small>
                                <small><?php echo $functions->formatDate($rental['contract_end']); ?></small>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small>Status:</small>
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
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="card animate-fadeIn">
            <div class="card-header">
                <h5><i class="fas fa-bolt mr-2"></i>Quick Actions</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <button class="btn btn-outline-primary w-100 mb-2" onclick="window.location.href='map.php'">
                            <i class="fas fa-map fa-2x mb-2"></i><br>
                            View Cemetery Map
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-success w-100 mb-2" onclick="window.location.href='my-graves.php'">
                            <i class="fas fa-cross fa-2x mb-2"></i><br>
                            Manage My Plots
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-info w-100 mb-2" onclick="openModal('inquiryModal')">
                            <i class="fas fa-envelope fa-2x mb-2"></i><br>
                            Send Inquiry
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-warning w-100 mb-2" onclick="window.location.href='profile.php'">
                            <i class="fas fa-user fa-2x mb-2"></i><br>
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Inquiry Modal -->
    <div id="inquiryModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h5><i class="fas fa-envelope mr-2"></i>Send Inquiry</h5>
                <button type="button" onclick="closeModal('inquiryModal')" class="btn-close">&times;</button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" name="action" value="send_inquiry">
                    <div class="form-group">
                        <label class="form-label">Subject</label>
                        <input type="text" name="subject" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-control" rows="4" required 
                                  placeholder="Please describe your inquiry..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('inquiryModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane mr-2"></i>Send Inquiry
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>

    <style>
        .payment-item {
            padding: 15px;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            transition: var(--transition);
        }
        
        .payment-item:hover {
            border-color: var(--primary-color);
            box-shadow: var(--shadow-sm);
        }
        
        .payment-details {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--gray-200);
        }
        
        .rental-item {
            padding: 10px;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
        }
        
        .rental-item:hover {
            border-color: var(--info-color);
        }
    </style>
</body>
</html>