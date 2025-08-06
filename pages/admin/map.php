<?php
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Check if user is admin
$auth->requireAdmin();

$currentUser = $auth->getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cemetery Map - Sanctuario Admin</title>
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
            <li><a href="map.php" class="active"><i class="fas fa-map"></i>Map</a></li>
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
                <h1>Interactive Cemetery Map</h1>
                <p class="text-muted">3D Digital Mapping System</p>
            </div>
            <div>
                <button class="btn btn-primary">
                    <i class="fas fa-expand mr-2"></i>Fullscreen
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-cog mr-2"></i>Map Settings
                </button>
            </div>
        </div>

        <!-- Map Container -->
        <div class="card" style="height: calc(100vh - 200px);">
            <div class="card-body d-flex align-items-center justify-content-center">
                <div class="text-center">
                    <i class="fas fa-map fa-5x text-muted mb-4"></i>
                    <h3 class="text-muted">3D Cemetery Map</h3>
                    <p class="text-muted mb-4">
                        This section is reserved for your custom 3D interactive cemetery map.<br>
                        The map will display plot locations, availability status, and burial information.
                    </p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle mr-2"></i>
                        <strong>Note:</strong> Please upload your 3D cemetery map model to this section.
                        The system is ready to integrate with various 3D mapping technologies.
                    </div>
                    
                    <!-- Map Legend -->
                    <div class="row mt-4">
                        <div class="col-md-6 offset-md-3">
                            <div class="card">
                                <div class="card-header">
                                    <h6><i class="fas fa-list mr-2"></i>Map Legend</h6>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span><i class="fas fa-square text-success mr-2"></i>Available Plots</span>
                                        <span class="badge badge-success">Ready for Sale</span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span><i class="fas fa-square text-danger mr-2"></i>Occupied Plots</span>
                                        <span class="badge badge-danger">Has Burial</span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span><i class="fas fa-square text-warning mr-2"></i>Reserved Plots</span>
                                        <span class="badge badge-warning">Reserved</span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span><i class="fas fa-square text-secondary mr-2"></i>Maintenance</span>
                                        <span class="badge badge-secondary">Under Maintenance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Map Controls -->
        <div class="row mt-4">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-search mr-2"></i>Search Plot</h6>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Enter plot number...">
                        </div>
                        <button class="btn btn-primary btn-sm w-100">
                            <i class="fas fa-search mr-2"></i>Find Plot
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-filter mr-2"></i>Filter by Type</h6>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <select class="form-control form-select">
                                <option>All Plot Types</option>
                                <option>Lawn Lots</option>
                                <option>Garden Lots</option>
                                <option>Mini Mausoleum Lots</option>
                                <option>Mausoleum Lots</option>
                                <option>Rental Apartment Niche</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-eye mr-2"></i>View Options</h6>
                    </div>
                    <div class="card-body">
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="showLabels" checked>
                            <label class="form-check-label" for="showLabels">Show Plot Labels</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="showPaths" checked>
                            <label class="form-check-label" for="showPaths">Show Pathways</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-info-circle mr-2"></i>Quick Stats</h6>
                    </div>
                    <div class="card-body">
                        <div class="small">
                            <div class="d-flex justify-content-between">
                                <span>Total Plots:</span>
                                <strong>150</strong>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Available:</span>
                                <strong class="text-success">45</strong>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Occupied:</span>
                                <strong class="text-danger">105</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>
    <script>
        // Map functionality will be implemented here
        // This is where you would integrate your 3D map library
        
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize 3D map
            console.log('3D Cemetery Map ready for integration');
            
            // Example of what could be implemented:
            // - Plot click handlers
            // - Zoom controls
            // - Plot information popups
            // - Real-time status updates
        });
    </script>
</body>
</html>