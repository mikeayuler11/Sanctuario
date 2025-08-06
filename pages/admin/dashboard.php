<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is admin
$auth->requireAdmin();

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
    <title>Admin Dashboard - Sanctuario de Santa Rosa de Lima</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h4><i class="fas fa-cross mr-2"></i>Sanctuario Admin</h4>
            <p class="mb-0">Welcome, <?php echo htmlspecialchars($currentUser['first_name']); ?></p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
            <li><a href="map.php"><i class="fas fa-map"></i>Map</a></li>
            <li><a href="grave-management.php"><i class="fas fa-cross"></i>Grave Management</a></li>
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
                <h1>Dashboard</h1>
                <p class="text-muted">Welcome to your cemetery management dashboard</p>
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

            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="stat-number"><?php echo $stats['maintenance_tasks']; ?></div>
                        <div class="stat-label">Maintenance Tasks</div>
                        <small class="text-danger">Scheduled/In Progress</small>
                    </div>
                    <div class="text-danger">
                        <i class="fas fa-tools fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card animate-slideInLeft">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-pie mr-2"></i>Burial Statistics</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="burialChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card animate-slideInRight">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar mr-2"></i>Plot Occupancy by Type</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="plotChart" width="400" height="200"></canvas>
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
                    <div class="card-footer">
                        <a href="#" class="btn btn-sm btn-outline-primary">View All Activities</a>
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
                        <a href="maintenance.php" class="btn btn-sm btn-outline-primary">View All Tasks</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>
    <script>
        // Initialize dashboard charts
        document.addEventListener('DOMContentLoaded', function() {
            // Burial statistics chart
            const burialCtx = document.getElementById('burialChart');
            if (burialCtx) {
                new Chart(burialCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Fresh Bodies', 'Bones'],
                        datasets: [{
                            data: [<?php echo $stats['fresh_bodies']; ?>, <?php echo $stats['bones']; ?>],
                            backgroundColor: ['#3498db', '#e74c3c'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            // Plot occupancy chart
            const plotCtx = document.getElementById('plotChart');
            if (plotCtx) {
                new Chart(plotCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Lawn Lots', 'Garden Lots', 'Mini Mausoleum', 'Mausoleum', 'Rental Niche'],
                        datasets: [{
                            label: 'Occupied',
                            data: [12, 8, 5, 3, 15],
                            backgroundColor: '#27ae60',
                            borderRadius: 4
                        }, {
                            label: 'Available',
                            data: [8, 12, 15, 17, 5],
                            backgroundColor: '#95a5a6',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
            }
        });
    </script>

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