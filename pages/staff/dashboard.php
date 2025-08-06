<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is staff
$auth->requireStaffOrAdmin();

$currentUser = $auth->getCurrentUser();
$stats = $functions->getDashboardStats();
$recentActivities = $functions->getRecentActivities(5);
$upcomingTasks = $functions->getUpcomingTasks(5);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Dashboard - Sanctuario de Santa Rosa de Lima</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h4><i class="fas fa-cross mr-2"></i>Sanctuario Staff</h4>
            <p class="mb-0">Welcome, <?php echo htmlspecialchars($currentUser['first_name']); ?></p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
            <li><a href="../admin/map.php"><i class="fas fa-map"></i>Map</a></li>
            <li><a href="../admin/grave-management.php"><i class="fas fa-cross"></i>Grave Management</a></li>
            <li><a href="../admin/inquiries.php"><i class="fas fa-envelope"></i>Inquiries</a></li>
            <li><a href="../admin/maintenance.php"><i class="fas fa-tools"></i>Maintenance</a></li>
            <li><a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1>Staff Dashboard</h1>
                <p class="text-muted">Cemetery management operations dashboard</p>
            </div>
            <div>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i class="fas fa-sync-alt mr-2"></i>Refresh
                </button>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid animate-fadeIn">
            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $stats['total_burials']; ?></div>
                        <div class="stat-label">Total Buried</div>
                        <small class="text-muted">
                            <?php echo $stats['fresh_bodies']; ?> fresh bodies, <?php echo $stats['bones']; ?> bones
                        </small>
                    </div>
                    <div class="text-primary">
                        <i class="fas fa-user-friends fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $stats['occupied_plots']; ?></div>
                        <div class="stat-label">Occupied Plots</div>
                        <small class="text-success">Active burials</small>
                    </div>
                    <div class="text-success">
                        <i class="fas fa-home fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $stats['available_plots']; ?></div>
                        <div class="stat-label">Available Plots</div>
                        <small class="text-info">Ready for sale</small>
                    </div>
                    <div class="text-info">
                        <i class="fas fa-plus-circle fa-2x"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $stats['open_inquiries']; ?></div>
                        <div class="stat-label">Open Inquiries</div>
                        <small class="text-warning">Pending response</small>
                    </div>
                    <div class="text-warning">
                        <i class="fas fa-envelope-open fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card animate-fadeIn">
                    <div class="card-body text-center">
                        <i class="fas fa-plus-circle fa-3x text-success mb-3"></i>
                        <h6>Add Burial</h6>
                        <p class="text-muted small">Record new burial</p>
                        <a href="../admin/grave-management.php" class="btn btn-success btn-sm">
                            <i class="fas fa-plus mr-1"></i>Add Burial
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card animate-fadeIn">
                    <div class="card-body text-center">
                        <i class="fas fa-envelope fa-3x text-info mb-3"></i>
                        <h6>Manage Inquiries</h6>
                        <p class="text-muted small">Respond to client inquiries</p>
                        <a href="../admin/inquiries.php" class="btn btn-info btn-sm">
                            <i class="fas fa-envelope mr-1"></i>View Inquiries
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card animate-fadeIn">
                    <div class="card-body text-center">
                        <i class="fas fa-tools fa-3x text-warning mb-3"></i>
                        <h6>Maintenance Tasks</h6>
                        <p class="text-muted small">Schedule maintenance</p>
                        <a href="../admin/maintenance.php" class="btn btn-warning btn-sm">
                            <i class="fas fa-tools mr-1"></i>View Tasks
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card animate-fadeIn">
                    <div class="card-body text-center">
                        <i class="fas fa-map fa-3x text-primary mb-3"></i>
                        <h6>Cemetery Map</h6>
                        <p class="text-muted small">View plot locations</p>
                        <a href="../admin/map.php" class="btn btn-primary btn-sm">
                            <i class="fas fa-map mr-1"></i>View Map
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activities & Upcoming Tasks -->
        <div class="row">
            <div class="col-md-6">
                <div class="card animate-slideInLeft">
                    <div class="card-header">
                        <h5><i class="fas fa-clock mr-2"></i>Recent Activities</h5>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        <?php if (empty($recentActivities)): ?>
                            <p class="text-muted text-center">No recent activities</p>
                        <?php else: ?>
                            <div class="timeline">
                                <?php foreach ($recentActivities as $activity): ?>
                                <div class="timeline-item">
                                    <div class="timeline-marker"></div>
                                    <div class="timeline-content">
                                        <h6><?php echo htmlspecialchars($activity['action']); ?></h6>
                                        <p class="mb-1"><?php echo htmlspecialchars($activity['description']); ?></p>
                                        <small class="text-muted">
                                            by <?php echo htmlspecialchars($activity['first_name'] . ' ' . $activity['last_name']); ?>
                                            • <?php echo $functions->formatDateTime($activity['date_created']); ?>
                                        </small>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card animate-slideInRight">
                    <div class="card-header">
                        <h5><i class="fas fa-calendar-check mr-2"></i>Upcoming Tasks</h5>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        <?php if (empty($upcomingTasks)): ?>
                            <p class="text-muted text-center">No upcoming tasks</p>
                        <?php else: ?>
                            <?php foreach ($upcomingTasks as $task): ?>
                            <div class="task-item mb-3">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1"><?php echo htmlspecialchars($task['maintenance_type']); ?></h6>
                                        <p class="mb-1">
                                            <i class="fas fa-map-marker-alt mr-1"></i>
                                            Plot <?php echo htmlspecialchars($task['plot_number']); ?> 
                                            (<?php echo htmlspecialchars($task['plot_type']); ?>)
                                        </p>
                                        <small class="text-muted">
                                            <i class="fas fa-user mr-1"></i><?php echo htmlspecialchars($task['performed_by']); ?>
                                        </small>
                                    </div>
                                    <div>
                                        <span class="badge badge-<?php echo $task['status'] === 'scheduled' ? 'warning' : 'info'; ?>">
                                            <?php echo ucfirst($task['status']); ?>
                                        </span>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <small class="text-info">
                                        <i class="fas fa-calendar mr-1"></i>
                                        <?php echo $functions->formatDate($task['start_date']); ?>
                                    </small>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    <div class="card-footer">
                        <a href="../admin/maintenance.php" class="btn btn-sm btn-outline-primary">View All Tasks</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>

    <style>
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 20px;
        }
        
        .timeline-marker {
            position: absolute;
            left: -35px;
            top: 5px;
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
        }
        
        .timeline-marker::before {
            content: '';
            position: absolute;
            left: 5px;
            top: 12px;
            width: 2px;
            height: 40px;
            background: var(--gray-300);
        }
        
        .timeline-item:last-child .timeline-marker::before {
            display: none;
        }
        
        .task-item {
            padding: 15px;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            transition: var(--transition);
        }
        
        .task-item:hover {
            border-color: var(--primary-color);
            box-shadow: var(--shadow-sm);
        }
    </style>
</body>
</html>