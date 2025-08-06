<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['client']);

$database = new Database();
$db = $database->getConnection();
$client_id = $_SESSION['user_id'];

// Get client's plot purchases
$query = "
    SELECT 
        pp.*,
        p.plot_number,
        pt.name as plot_type,
        pt.area_sqm
    FROM plot_purchases pp
    JOIN plots p ON pp.plot_id = p.id
    JOIN plot_types pt ON p.plot_type_id = pt.id
    WHERE pp.client_id = :client_id
    ORDER BY pp.created_at DESC
";
$stmt = $db->prepare($query);
$stmt->bindParam(':client_id', $client_id);
$stmt->execute();
$my_plots = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get client's rental niches
$query = "SELECT * FROM rental_niches WHERE client_id = :client_id ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->bindParam(':client_id', $client_id);
$stmt->execute();
$my_niches = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get client's burials
$query = "
    SELECT 
        b.*,
        p.plot_number,
        pt.name as plot_type
    FROM burials b
    JOIN plots p ON b.plot_id = p.id
    JOIN plot_types pt ON p.plot_type_id = pt.id
    JOIN plot_purchases pp ON p.id = pp.plot_id
    WHERE pp.client_id = :client_id
    ORDER BY b.created_at DESC
";
$stmt = $db->prepare($query);
$stmt->bindParam(':client_id', $client_id);
$stmt->execute();
$my_burials = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get client's inquiries
$query = "SELECT * FROM inquiries WHERE email = :email ORDER BY created_at DESC LIMIT 5";
$stmt = $db->prepare($query);
$stmt->bindParam(':email', $_SESSION['email']);
$stmt->execute();
$my_inquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate statistics
$total_plots = count($my_plots);
$total_niches = count($my_niches);
$total_burials = count($my_burials);
$outstanding_balance = array_sum(array_column($my_plots, 'outstanding_balance'));
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard - Cemetery Management System</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-cross"></i> Sanctuario Portal</h2>
                <p style="color: #bdc3c7; font-size: 0.9rem;"><?php echo $_SESSION['full_name']; ?></p>
                <p style="color: #95a5a6; font-size: 0.8rem; text-transform: uppercase;">Client</p>
            </div>
            <ul class="sidebar-nav">
                <li><a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="map.php"><i class="fas fa-map"></i> Map</a></li>
                <li><a href="my_graves.php"><i class="fas fa-bed"></i> My Graves</a></li>
                <li><a href="inquiries.php"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="profile.php"><i class="fas fa-user"></i> Profile</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>Welcome, <?php echo htmlspecialchars($_SESSION['full_name']); ?></h1>
                <p class="breadcrumb">Client Portal > Dashboard</p>
            </div>

            <!-- Statistics Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <span class="card-title">My Plots</span>
                        <i class="fas fa-home card-icon"></i>
                    </div>
                    <div class="card-value"><?php echo $total_plots; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Purchased plots</p>
                </div>

                <div class="dashboard-card blue">
                    <div class="card-header">
                        <span class="card-title">Rental Niches</span>
                        <i class="fas fa-building card-icon" style="color: #3498db;"></i>
                    </div>
                    <div class="card-value"><?php echo $total_niches; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Active rentals</p>
                </div>

                <div class="dashboard-card green">
                    <div class="card-header">
                        <span class="card-title">Burials</span>
                        <i class="fas fa-users card-icon" style="color: #2ecc71;"></i>
                    </div>
                    <div class="card-value"><?php echo $total_burials; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Total interments</p>
                </div>

                <div class="dashboard-card orange">
                    <div class="card-header">
                        <span class="card-title">Outstanding Balance</span>
                        <i class="fas fa-money-bill-wave card-icon" style="color: #f39c12;"></i>
                    </div>
                    <div class="card-value">₱<?php echo number_format($outstanding_balance, 2); ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Amount due</p>
                </div>
            </div>

            <!-- Content Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <!-- My Plot Purchases -->
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title"><i class="fas fa-home"></i> My Plot Purchases</h3>
                        <a href="my_graves.php" class="btn btn-primary btn-sm">View All</a>
                    </div>
                    <div style="padding: 1rem;">
                        <?php if (empty($my_plots)): ?>
                            <p style="text-align: center; color: #7f8c8d; padding: 2rem;">No plot purchases found</p>
                        <?php else: ?>
                            <?php foreach (array_slice($my_plots, 0, 3) as $plot): ?>
                                <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <p style="margin: 0; font-weight: 500; color: #2c3e50;">
                                            Plot <?php echo htmlspecialchars($plot['plot_number']); ?>
                                        </p>
                                        <p style="margin: 0; font-size: 0.9rem; color: #555;">
                                            <?php echo htmlspecialchars($plot['plot_type']); ?> - <?php echo $plot['area_sqm']; ?> sqm
                                        </p>
                                        <p style="margin: 0; font-size: 0.8rem; color: #7f8c8d;">
                                            <?php echo ucfirst(str_replace('_', ' ', $plot['payment_mode'])); ?>
                                        </p>
                                    </div>
                                    <div style="text-align: right;">
                                        <span class="status-badge <?php 
                                            echo $plot['status'] == 'completed' ? 'status-active' : 
                                                ($plot['status'] == 'defaulted' ? 'status-inactive' : 'status-pending'); 
                                        ?>">
                                            <?php echo ucfirst($plot['status']); ?>
                                        </span>
                                        <?php if ($plot['outstanding_balance'] > 0): ?>
                                            <br><small style="color: #e74c3c;">₱<?php echo number_format($plot['outstanding_balance'], 2); ?> due</small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Recent Inquiries -->
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title"><i class="fas fa-envelope"></i> Recent Inquiries</h3>
                        <a href="inquiries.php" class="btn btn-primary btn-sm">View All</a>
                    </div>
                    <div style="padding: 1rem;">
                        <?php if (empty($my_inquiries)): ?>
                            <p style="text-align: center; color: #7f8c8d; padding: 2rem;">No inquiries found</p>
                        <?php else: ?>
                            <?php foreach ($my_inquiries as $inquiry): ?>
                                <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <p style="margin: 0; font-weight: 500; color: #2c3e50;">
                                            <?php echo htmlspecialchars($inquiry['subject']); ?>
                                        </p>
                                        <p style="margin: 0; font-size: 0.8rem; color: #7f8c8d;">
                                            <?php echo date('M j, Y', strtotime($inquiry['created_at'])); ?>
                                        </p>
                                    </div>
                                    <span class="status-badge <?php 
                                        echo $inquiry['status'] == 'replied' ? 'status-active' : 
                                            ($inquiry['status'] == 'unread' ? 'status-pending' : 'status-inactive'); 
                                    ?>">
                                        <?php echo ucfirst($inquiry['status']); ?>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Burials Section -->
            <?php if (!empty($my_burials)): ?>
            <div class="table-container" style="margin-top: 2rem;">
                <div class="table-header">
                    <h3 class="table-title"><i class="fas fa-users"></i> My Family Members</h3>
                </div>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Plot</th>
                                <th>Date of Birth</th>
                                <th>Date of Death</th>
                                <th>Date of Interment</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($my_burials as $burial): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($burial['deceased_name']); ?></td>
                                    <td><?php echo htmlspecialchars($burial['plot_number']); ?></td>
                                    <td><?php echo date('M j, Y', strtotime($burial['date_of_birth'])); ?></td>
                                    <td><?php echo date('M j, Y', strtotime($burial['date_of_death'])); ?></td>
                                    <td><?php echo date('M j, Y', strtotime($burial['date_of_interment'])); ?></td>
                                    <td>
                                        <span class="status-badge <?php echo $burial['burial_type'] == 'fresh_body' ? 'status-active' : 'status-pending'; ?>">
                                            <?php echo $burial['burial_type'] == 'fresh_body' ? 'Fresh Body' : 'Bones'; ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php endif; ?>

            <!-- Quick Actions -->
            <div class="table-container" style="margin-top: 2rem;">
                <div class="table-header">
                    <h3 class="table-title"><i class="fas fa-bolt"></i> Quick Actions</h3>
                </div>
                <div style="padding: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <button class="btn btn-primary" onclick="window.location.href='../index.php#contact'" style="padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-envelope"></i> Contact Us
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='map.php'" style="padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-map"></i> View Cemetery Map
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='profile.php'" style="padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-user-edit"></i> Update Profile
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='my_graves.php'" style="padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-list"></i> View All Properties
                    </button>
                </div>
            </div>
        </main>
    </div>
</body>
</html>