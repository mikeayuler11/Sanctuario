<?php
session_start();
require_once 'config/database.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

$auth = new Auth();
$functions = new CemeteryFunctions();

// Handle login
if ($_POST['action'] ?? '' === 'login') {
    $result = $auth->login($_POST['username'], $_POST['password']);
    if ($result['success']) {
        // Redirect based on user type
        switch ($result['user_type']) {
            case 'admin':
                header('Location: pages/admin/dashboard.php');
                break;
            case 'staff':
                header('Location: pages/staff/dashboard.php');
                break;
            case 'client':
                header('Location: pages/client/dashboard.php');
                break;
        }
        exit();
    } else {
        $login_error = $result['message'];
    }
}

// Handle registration
if ($_POST['action'] ?? '' === 'register') {
    $result = $auth->register($_POST);
    if ($result['success']) {
        $register_success = $result['message'];
    } else {
        $register_error = $result['message'];
    }
}

// Handle inquiry submission
if ($_POST['action'] ?? '' === 'inquiry') {
    try {
        $db = new Database();
        $stmt = $db->query(
            "INSERT INTO inquiries (name, email, phone, address, subject, message) VALUES (?, ?, ?, ?, ?, ?)",
            [$_POST['name'], $_POST['email'], $_POST['phone'], $_POST['address'], $_POST['subject'], $_POST['message']]
        );
        $inquiry_success = "Your inquiry has been submitted successfully. We will contact you soon.";
    } catch (Exception $e) {
        $inquiry_error = "Failed to submit inquiry. Please try again.";
    }
}

// Get plot types
$plotTypes = $functions->getPlotTypes();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sanctuario de Santa Rosa de Lima Memorial Park</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <a href="#" class="navbar-brand">
                    <i class="fas fa-cross mr-2"></i>
                    Sanctuario de Santa Rosa de Lima
                </a>
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-outline" onclick="openModal('loginModal')">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login
                    </button>
                    <button class="btn btn-primary" onclick="openModal('registerModal')">
                        <i class="fas fa-user-plus mr-2"></i>Register
                    </button>
                    <button class="btn btn-secondary" onclick="openModal('inquiryModal')">
                        <i class="fas fa-envelope mr-2"></i>Inquiry
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content animate-fadeIn">
            <h1 class="text-gradient animate-bounce">
                Sanctuario de Santa Rosa de Lima Memorial Park
            </h1>
            <p class="tagline animate-slideInLeft">
                COMFORT & ELEGANCE IN AFTERLIFE
            </p>
            <div class="mt-4 animate-slideInRight">
                <button class="btn btn-primary btn-lg mr-3" onclick="document.getElementById('services').scrollIntoView()">
                    <i class="fas fa-info-circle mr-2"></i>Explore Our Services
                </button>
                <button class="btn btn-outline btn-lg" onclick="openModal('inquiryModal')">
                    <i class="fas fa-phone mr-2"></i>Contact Us
                </button>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-5 bg-white" id="about">
        <div class="container">
            <div class="row align-items-center">
                <div class="col animate-slideInLeft">
                    <h2 class="text-gradient mb-4">About Us</h2>
                    <p class="mb-4">
                        <strong>Sanctuario De Santa Rosa De Lima Memorial Park</strong> operates under La Rosario Villa and Development Corp., 
                        one of the Rising Real Estate Companies of the province. Sanctuario offers the municipality of Bacacay 
                        prime memorial lots and resting places.
                    </p>
                    
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5><i class="fas fa-bullseye mr-2"></i>Our Mission</h5>
                        </div>
                        <div class="card-body">
                            <p>Sanctuario De Santa Rosa De Lima Memorial Park hopes to provide a solitude wherein hopes, healing and peace 
                            could be provided for the ones left behind by guaranteeing a tranquil resting place for their departed loved ones 
                            that would be regularly attended with care.</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-eye mr-2"></i>Our Vision</h5>
                        </div>
                        <div class="card-body">
                            <p>Sanctuario De Santa Rosa De Lima Memorial Park aspires to be the municipality of Bacacay's most prestigious 
                            memorial park with spacious, peaceful and expansive space that would cater all the needs of the people, 
                            client or loved ones.</p>
                        </div>
                    </div>
                </div>
                <div class="col animate-slideInRight">
                    <div class="card">
                        <div class="card-header text-center">
                            <h5><i class="fas fa-map-marker-alt mr-2"></i>Contact Information</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                                <strong>Address:</strong><br>
                                2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay
                            </div>
                            <div class="mb-3">
                                <i class="fas fa-phone text-success mr-2"></i>
                                <strong>Phone:</strong><br>
                                09454785649 / 09684412511
                            </div>
                            <div class="mb-3">
                                <i class="fas fa-envelope text-info mr-2"></i>
                                <strong>Email:</strong><br>
                                lrdvc.sanctuario22@gmail.com
                            </div>
                            <div class="mb-3">
                                <i class="fab fa-facebook text-primary mr-2"></i>
                                <strong>Facebook:</strong><br>
                                Sanctuario de Santa Rosa de Lima
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services/Lot Types Section -->
    <section class="lot-types" id="services">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="text-gradient animate-fadeIn">Our Memorial Lots & Services</h2>
                <p class="animate-slideInLeft">Choose from our variety of premium memorial lots designed for comfort and elegance</p>
            </div>
            
            <div class="lot-grid">
                <?php foreach ($plotTypes as $plotType): ?>
                <div class="lot-card animate-fadeIn">
                    <div class="lot-card-header">
                        <h3><?php echo htmlspecialchars($plotType['name']); ?></h3>
                        <div class="text-2xl font-bold mt-2">
                            <?php echo $functions->formatCurrency($plotType['price']); ?>
                        </div>
                    </div>
                    <div class="lot-card-body">
                        <ul class="lot-features">
                            <li>
                                <span>Lot Area:</span>
                                <strong><?php echo $plotType['area']; ?> sq.m</strong>
                            </li>
                            <li>
                                <span>Fresh Bodies:</span>
                                <strong><?php echo $plotType['capacity_fresh_bodies']; ?></strong>
                            </li>
                            <?php if ($plotType['capacity_bones'] > 0): ?>
                            <li>
                                <span>Bones:</span>
                                <strong><?php echo $plotType['capacity_bones']; ?> sets</strong>
                            </li>
                            <?php endif; ?>
                        </ul>
                        <p class="mt-3"><?php echo htmlspecialchars($plotType['description']); ?></p>
                        <div class="mt-4">
                            <button class="btn btn-primary w-100" onclick="openModal('inquiryModal')">
                                <i class="fas fa-info-circle mr-2"></i>Inquire Now
                            </button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h5><i class="fas fa-sign-in-alt mr-2"></i>Login</h5>
                <button type="button" onclick="closeModal('loginModal')" class="btn-close">&times;</button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <?php if (isset($login_error)): ?>
                        <div class="alert alert-danger"><?php echo $login_error; ?></div>
                    <?php endif; ?>
                    <input type="hidden" name="action" value="login">
                    <div class="form-group">
                        <label class="form-label">Username or Email</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('loginModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Register Modal -->
    <div id="registerModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h5><i class="fas fa-user-plus mr-2"></i>Create Account</h5>
                <button type="button" onclick="closeModal('registerModal')" class="btn-close">&times;</button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <?php if (isset($register_error)): ?>
                        <div class="alert alert-danger"><?php echo $register_error; ?></div>
                    <?php endif; ?>
                    <?php if (isset($register_success)): ?>
                        <div class="alert alert-success"><?php echo $register_success; ?></div>
                    <?php endif; ?>
                    <input type="hidden" name="action" value="register">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">First Name</label>
                                <input type="text" name="first_name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Last Name</label>
                                <input type="text" name="last_name" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="tel" name="phone" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <textarea name="address" class="form-control" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('registerModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-user-plus mr-2"></i>Create Account
                    </button>
                </div>
            </form>
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
                    <?php if (isset($inquiry_error)): ?>
                        <div class="alert alert-danger"><?php echo $inquiry_error; ?></div>
                    <?php endif; ?>
                    <?php if (isset($inquiry_success)): ?>
                        <div class="alert alert-success"><?php echo $inquiry_success; ?></div>
                    <?php endif; ?>
                    <input type="hidden" name="action" value="inquiry">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" name="name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="tel" name="phone" class="form-control">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label">Subject</label>
                                <input type="text" name="subject" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <input type="text" name="address" class="form-control">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-control" rows="4" required placeholder="Please describe your inquiry..."></textarea>
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

    <!-- Footer -->
    <footer class="py-5" style="background: var(--gradient-primary); color: white;">
        <div class="container text-center">
            <div class="mb-4">
                <h4>Sanctuario de Santa Rosa de Lima Memorial Park</h4>
                <p class="mb-0">Comfort & Elegance in Afterlife</p>
            </div>
            <div class="mb-4">
                <p class="mb-1">2nd Floor, Rose Bldg, Brgy. 7 Magsaysay Ave. Bacacay, Albay</p>
                <p class="mb-1">Phone: 09454785649 / 09684412511</p>
                <p class="mb-1">Email: lrdvc.sanctuario22@gmail.com</p>
            </div>
            <div>
                <p>&copy; <?php echo date('Y'); ?> Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
    <?php if (isset($login_error)): ?>
        <script>openModal('loginModal');</script>
    <?php endif; ?>
    <?php if (isset($register_error) || isset($register_success)): ?>
        <script>openModal('registerModal');</script>
    <?php endif; ?>
    <?php if (isset($inquiry_error) || isset($inquiry_success)): ?>
        <script>openModal('inquiryModal');</script>
    <?php endif; ?>
</body>
</html>