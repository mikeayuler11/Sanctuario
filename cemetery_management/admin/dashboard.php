<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);

$database = new Database();
$db = $database->getConnection();

// Get dashboard statistics
$stats = [];

// Total burials
$query = "SELECT COUNT(*) as total FROM burials";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_burials'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Fresh bodies count
$query = "SELECT COUNT(*) as total FROM burials WHERE burial_type = 'fresh_body'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['fresh_bodies'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Bones count
$query = "SELECT COUNT(*) as total FROM burials WHERE burial_type = 'bones'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['bones'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Occupied plots
$query = "SELECT COUNT(*) as total FROM plots WHERE status = 'sold'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['occupied_plots'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Available plots
$query = "SELECT COUNT(*) as total FROM plots WHERE status = 'available'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['available_plots'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Open inquiries
$query = "SELECT COUNT(*) as total FROM inquiries WHERE status = 'unread'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['open_inquiries'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Maintenance tasks
$query = "SELECT COUNT(*) as total FROM maintenance WHERE status IN ('scheduled', 'in_progress')";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['maintenance_tasks'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Recent activities
$query = "
    SELECT 'burial' as type, CONCAT('New burial: ', deceased_name) as activity, created_at 
    FROM burials 
    UNION ALL
    SELECT 'inquiry' as type, CONCAT('New inquiry: ', subject) as activity, created_at 
    FROM inquiries 
    UNION ALL
    SELECT 'maintenance' as type, CONCAT('Maintenance scheduled for plot: ', (SELECT plot_number FROM plots WHERE id = plot_id)) as activity, created_at 
    FROM maintenance 
    ORDER BY created_at DESC 
    LIMIT 10
";
$stmt = $db->prepare($query);
$stmt->execute();
$recent_activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Upcoming tasks
$query = "
    SELECT m.*, p.plot_number, pt.name as plot_type_name
    FROM maintenance m
    JOIN plots p ON m.plot_id = p.id
    JOIN plot_types pt ON p.plot_type_id = pt.id
    WHERE m.status = 'scheduled' AND m.start_date >= CURDATE()
    ORDER BY m.start_date ASC
    LIMIT 5
";
$stmt = $db->prepare($query);
$stmt->execute();
$upcoming_tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Cemetery Management System</title>
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
                <li><a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="map.php"><i class="fas fa-map"></i> Map</a></li>
                <li><a href="grave_management.php"><i class="fas fa-bed"></i> Grave Management</a></li>
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
                <h1>Dashboard</h1>
                <p class="breadcrumb">Home > Dashboard</p>
            </div>

            <!-- Statistics Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <span class="card-title">Total Burials</span>
                        <i class="fas fa-users card-icon"></i>
                    </div>
                    <div class="card-value"><?php echo $stats['total_burials']; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">
                        Fresh Bodies: <?php echo $stats['fresh_bodies']; ?> | Bones: <?php echo $stats['bones']; ?>
                    </p>
                </div>

                <div class="dashboard-card blue">
                    <div class="card-header">
                        <span class="card-title">Occupied Plots</span>
                        <i class="fas fa-home card-icon" style="color: #3498db;"></i>
                    </div>
                    <div class="card-value"><?php echo $stats['occupied_plots']; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Currently in use</p>
                </div>

                <div class="dashboard-card green">
                    <div class="card-header">
                        <span class="card-title">Available Plots</span>
                        <i class="fas fa-plus-circle card-icon" style="color: #2ecc71;"></i>
                    </div>
                    <div class="card-value"><?php echo $stats['available_plots']; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Ready for sale</p>
                </div>

                <div class="dashboard-card orange">
                    <div class="card-header">
                        <span class="card-title">Open Inquiries</span>
                        <i class="fas fa-envelope-open card-icon" style="color: #f39c12;"></i>
                    </div>
                    <div class="card-value"><?php echo $stats['open_inquiries']; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Unread messages</p>
                </div>

                <div class="dashboard-card purple">
                    <div class="card-header">
                        <span class="card-title">Maintenance Tasks</span>
                        <i class="fas fa-wrench card-icon" style="color: #9b59b6;"></i>
                    </div>
                    <div class="card-value"><?php echo $stats['maintenance_tasks']; ?></div>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;">Active & scheduled</p>
                </div>
            </div>

            <!-- Content Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <!-- Recent Activities -->
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title"><i class="fas fa-clock"></i> Recent Activities</h3>
                    </div>
                    <div style="padding: 1rem;">
                        <?php if (empty($recent_activities)): ?>
                            <p style="text-align: center; color: #7f8c8d; padding: 2rem;">No recent activities</p>
                        <?php else: ?>
                            <?php foreach ($recent_activities as $activity): ?>
                                <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; align-items: center;">
                                    <div style="margin-right: 1rem;">
                                        <?php if ($activity['type'] == 'burial'): ?>
                                            <i class="fas fa-user-plus" style="color: #e74c3c; font-size: 1.2rem;"></i>
                                        <?php elseif ($activity['type'] == 'inquiry'): ?>
                                            <i class="fas fa-envelope" style="color: #f39c12; font-size: 1.2rem;"></i>
                                        <?php else: ?>
                                            <i class="fas fa-tools" style="color: #9b59b6; font-size: 1.2rem;"></i>
                                        <?php endif; ?>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="margin: 0; font-weight: 500; color: #2c3e50;"><?php echo htmlspecialchars($activity['activity']); ?></p>
                                        <p style="margin: 0; font-size: 0.8rem; color: #7f8c8d;"><?php echo date('M j, Y g:i A', strtotime($activity['created_at'])); ?></p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Upcoming Tasks -->
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title"><i class="fas fa-calendar-alt"></i> Upcoming Tasks</h3>
                        <a href="maintenance.php" class="btn btn-primary btn-sm">View All</a>
                    </div>
                    <div style="padding: 1rem;">
                        <?php if (empty($upcoming_tasks)): ?>
                            <p style="text-align: center; color: #7f8c8d; padding: 2rem;">No upcoming tasks</p>
                        <?php else: ?>
                            <?php foreach ($upcoming_tasks as $task): ?>
                                <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; align-items: center;">
                                    <div style="margin-right: 1rem;">
                                        <i class="fas fa-calendar" style="color: #3498db; font-size: 1.2rem;"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="margin: 0; font-weight: 500; color: #2c3e50;">
                                            Plot <?php echo htmlspecialchars($task['plot_number']); ?> - <?php echo htmlspecialchars($task['plot_type_name']); ?>
                                        </p>
                                        <p style="margin: 0; font-size: 0.9rem; color: #555;">
                                            Performed by: <?php echo htmlspecialchars($task['performed_by']); ?>
                                        </p>
                                        <p style="margin: 0; font-size: 0.8rem; color: #7f8c8d;">
                                            Scheduled: <?php echo date('M j, Y', strtotime($task['start_date'])); ?>
                                        </p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>