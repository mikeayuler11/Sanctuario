<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
$auth->requireRole(['admin']);

$database = new Database();
$db = $database->getConnection();

// Handle settings update
if ($_POST && isset($_POST['update_settings'])) {
    $settings = [
        'company_name' => $_POST['company_name'],
        'company_address' => $_POST['company_address'],
        'company_phone' => $_POST['company_phone'],
        'company_email' => $_POST['company_email'],
        'company_facebook' => $_POST['company_facebook']
    ];
    
    foreach ($settings as $key => $value) {
        $query = "UPDATE system_settings SET setting_value = :value WHERE setting_key = :key";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':value', $value);
        $stmt->bindParam(':key', $key);
        $stmt->execute();
    }
    
    $success_message = "Settings updated successfully!";
}

// Handle user creation
if ($_POST && isset($_POST['create_user'])) {
    $user_data = [
        'username' => $_POST['username'],
        'email' => $_POST['email'],
        'password' => $_POST['password'],
        'first_name' => $_POST['first_name'],
        'last_name' => $_POST['last_name'],
        'phone' => $_POST['phone'],
        'address' => $_POST['address'],
        'user_type' => $_POST['user_type']
    ];
    
    $auth_obj = new Auth();
    if ($auth_obj->register($user_data)) {
        $success_message = "User created successfully!";
    } else {
        $error_message = "Error creating user. Please check if username/email already exists.";
    }
}

// Handle plot type creation
if ($_POST && isset($_POST['create_plot_type'])) {
    $query = "INSERT INTO plot_types (name, area_sqm, fresh_body_capacity, bones_capacity, description, price) VALUES (:name, :area_sqm, :fresh_body_capacity, :bones_capacity, :description, :price)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $_POST['plot_type_name']);
    $stmt->bindParam(':area_sqm', $_POST['area_sqm']);
    $stmt->bindParam(':fresh_body_capacity', $_POST['fresh_body_capacity']);
    $stmt->bindParam(':bones_capacity', $_POST['bones_capacity']);
    $stmt->bindParam(':description', $_POST['plot_description']);
    $stmt->bindParam(':price', $_POST['price']);
    
    if ($stmt->execute()) {
        $success_message = "Plot type created successfully!";
    } else {
        $error_message = "Error creating plot type.";
    }
}

// Get current settings
$query = "SELECT * FROM system_settings";
$stmt = $db->prepare($query);
$stmt->execute();
$settings_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
$settings = [];
foreach ($settings_raw as $setting) {
    $settings[$setting['setting_key']] = $setting['setting_value'];
}

// Get users
$query = "SELECT * FROM users ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get plot types
$query = "SELECT * FROM plot_types ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$plot_types = $stmt->fetchAll(PDO::FETCH_ASSOC);

$active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'general';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Cemetery Management System</title>
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
            padding: 2rem;
        }
        .tab-content.active {
            display: block;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
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
                <li><a href="amortization.php"><i class="fas fa-calculator"></i> Amortization</a></li>
                <li><a href="inquiries.php"><i class="fas fa-envelope"></i> Inquiries</a></li>
                <li><a href="maintenance.php"><i class="fas fa-tools"></i> Maintenance</a></li>
                <li><a href="settings.php" class="active"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../includes/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <h1>System Settings</h1>
                <p class="breadcrumb">Home > Settings</p>
            </div>

            <?php if (isset($success_message)): ?>
                <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $success_message; ?>
                </div>
            <?php endif; ?>

            <?php if (isset($error_message)): ?>
                <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>

            <!-- Tab Container -->
            <div class="tab-container">
                <div class="tab-header">
                    <button class="tab-button <?php echo $active_tab == 'general' ? 'active' : ''; ?>" onclick="switchTab('general')">
                        <i class="fas fa-cog"></i> General Settings
                    </button>
                    <button class="tab-button <?php echo $active_tab == 'users' ? 'active' : ''; ?>" onclick="switchTab('users')">
                        <i class="fas fa-users"></i> User Management
                    </button>
                    <button class="tab-button <?php echo $active_tab == 'plot_types' ? 'active' : ''; ?>" onclick="switchTab('plot_types')">
                        <i class="fas fa-home"></i> Plot Types
                    </button>
                </div>

                <!-- General Settings Tab -->
                <div id="general-tab" class="tab-content <?php echo $active_tab == 'general' ? 'active' : ''; ?>">
                    <h3><i class="fas fa-building"></i> Company Information</h3>
                    <form method="POST">
                        <div class="form-group">
                            <label for="company_name">Company Name</label>
                            <input type="text" id="company_name" name="company_name" class="form-control" value="<?php echo htmlspecialchars($settings['company_name'] ?? ''); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="company_address">Address</label>
                            <textarea id="company_address" name="company_address" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;" required><?php echo htmlspecialchars($settings['company_address'] ?? ''); ?></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="company_phone">Phone Numbers</label>
                                <input type="text" id="company_phone" name="company_phone" class="form-control" value="<?php echo htmlspecialchars($settings['company_phone'] ?? ''); ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="company_email">Email</label>
                                <input type="email" id="company_email" name="company_email" class="form-control" value="<?php echo htmlspecialchars($settings['company_email'] ?? ''); ?>" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="company_facebook">Facebook Page</label>
                            <input type="text" id="company_facebook" name="company_facebook" class="form-control" value="<?php echo htmlspecialchars($settings['company_facebook'] ?? ''); ?>">
                        </div>
                        <button type="submit" name="update_settings" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </form>
                </div>

                <!-- User Management Tab -->
                <div id="users-tab" class="tab-content <?php echo $active_tab == 'users' ? 'active' : ''; ?>">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h3><i class="fas fa-users"></i> User Management</h3>
                        <button class="btn btn-primary" onclick="openCreateUserModal()">
                            <i class="fas fa-plus"></i> Create User
                        </button>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></td>
                                        <td><?php echo htmlspecialchars($user['username']); ?></td>
                                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                                        <td>
                                            <span class="status-badge <?php 
                                                echo $user['user_type'] == 'admin' ? 'status-inactive' : 
                                                    ($user['user_type'] == 'staff' ? 'status-pending' : 'status-active'); 
                                            ?>">
                                                <?php echo ucfirst($user['user_type']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge <?php echo $user['status'] == 'active' ? 'status-active' : 'status-inactive'; ?>">
                                                <?php echo ucfirst($user['status']); ?>
                                            </span>
                                        </td>
                                        <td><?php echo date('M j, Y', strtotime($user['created_at'])); ?></td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm" onclick="editUser(<?php echo $user['id']; ?>)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Plot Types Tab -->
                <div id="plot_types-tab" class="tab-content <?php echo $active_tab == 'plot_types' ? 'active' : ''; ?>">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h3><i class="fas fa-home"></i> Plot Types Management</h3>
                        <button class="btn btn-primary" onclick="openCreatePlotTypeModal()">
                            <i class="fas fa-plus"></i> Add Plot Type
                        </button>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Area (sqm)</th>
                                    <th>Fresh Body Capacity</th>
                                    <th>Bones Capacity</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($plot_types as $plot_type): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($plot_type['name']); ?></td>
                                        <td><?php echo $plot_type['area_sqm']; ?></td>
                                        <td><?php echo $plot_type['fresh_body_capacity']; ?></td>
                                        <td><?php echo $plot_type['bones_capacity']; ?></td>
                                        <td>₱<?php echo number_format($plot_type['price'], 2); ?></td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm" onclick="editPlotType(<?php echo $plot_type['id']; ?>)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Create User Modal -->
    <div id="createUserModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeCreateUserModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-user-plus"></i> Create New User
            </h2>
            <form method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label for="first_name">First Name</label>
                        <input type="text" id="first_name" name="first_name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="last_name">Last Name</label>
                        <input type="text" id="last_name" name="last_name" class="form-control" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="user_type">User Type</label>
                        <select id="user_type" name="user_type" class="filter-select" style="width: 100%;" required>
                            <option value="client">Client</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone" name="phone" class="form-control">
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <textarea id="address" name="address" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
                </div>
                <button type="submit" name="create_user" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-user-plus"></i> Create User
                </button>
            </form>
        </div>
    </div>

    <!-- Create Plot Type Modal -->
    <div id="createPlotTypeModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeCreatePlotTypeModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">
                <i class="fas fa-home"></i> Add Plot Type
            </h2>
            <form method="POST">
                <div class="form-group">
                    <label for="plot_type_name">Plot Type Name</label>
                    <input type="text" id="plot_type_name" name="plot_type_name" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="area_sqm">Area (Square Meters)</label>
                        <input type="number" step="0.01" id="area_sqm" name="area_sqm" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" step="0.01" id="price" name="price" class="form-control" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fresh_body_capacity">Fresh Body Capacity</label>
                        <input type="number" id="fresh_body_capacity" name="fresh_body_capacity" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="bones_capacity">Bones Capacity</label>
                        <input type="number" id="bones_capacity" name="bones_capacity" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="plot_description">Description</label>
                    <textarea id="plot_description" name="plot_description" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
                </div>
                <button type="submit" name="create_plot_type" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-plus"></i> Add Plot Type
                </button>
            </form>
        </div>
    </div>

    <script>
        function switchTab(tabName) {
            window.location.href = 'settings.php?tab=' + tabName;
        }

        function openCreateUserModal() {
            document.getElementById('createUserModal').style.display = 'block';
        }

        function closeCreateUserModal() {
            document.getElementById('createUserModal').style.display = 'none';
        }

        function openCreatePlotTypeModal() {
            document.getElementById('createPlotTypeModal').style.display = 'block';
        }

        function closeCreatePlotTypeModal() {
            document.getElementById('createPlotTypeModal').style.display = 'none';
        }

        function editUser(userId) {
            alert('Edit user functionality would be implemented here for user ID: ' + userId);
        }

        function editPlotType(plotTypeId) {
            alert('Edit plot type functionality would be implemented here for plot type ID: ' + plotTypeId);
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const createUserModal = document.getElementById('createUserModal');
            const createPlotTypeModal = document.getElementById('createPlotTypeModal');
            
            if (event.target == createUserModal) {
                closeCreateUserModal();
            }
            if (event.target == createPlotTypeModal) {
                closeCreatePlotTypeModal();
            }
        }
    </script>
</body>
</html>