<?php
require_once '../includes/auth.php';

$auth = new Auth();
$auth->requireRole(['admin', 'staff']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cemetery Map - Cemetery Management System</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .map-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .map-placeholder {
            text-align: center;
            color: #7f8c8d;
            padding: 3rem;
        }
        .map-placeholder i {
            font-size: 5rem;
            margin-bottom: 2rem;
            color: #e74c3c;
        }
        .map-placeholder h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        .map-placeholder p {
            font-size: 1.1rem;
            line-height: 1.6;
            max-width: 600px;
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
                <li><a href="map.php" class="active"><i class="fas fa-map"></i> Map</a></li>
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
                <h1>Cemetery Digital Map</h1>
                <p class="breadcrumb">Home > Map</p>
            </div>

            <!-- Map Container -->
            <div class="map-container">
                <div class="map-placeholder">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>3D Interactive Cemetery Map</h3>
                    <p>This area is reserved for your custom 3D interactive cemetery map. You can upload and integrate your 3D model here to provide a visual representation of the memorial park with clickable plot locations, navigation features, and real-time plot availability status.</p>
                    <p><strong>Features to be implemented:</strong></p>
                    <ul style="text-align: left; display: inline-block; margin-top: 1rem;">
                        <li>Interactive 3D visualization of the cemetery grounds</li>
                        <li>Clickable plot locations with detailed information</li>
                        <li>Real-time availability status (Available, Sold, Reserved)</li>
                        <li>Search and navigation to specific plots</li>
                        <li>Visual indicators for maintenance schedules</li>
                        <li>Integration with burial and plot purchase data</li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
</body>
</html>