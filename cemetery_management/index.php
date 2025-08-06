<?php
require_once 'includes/auth.php';

$auth = new Auth();

// Redirect if already logged in
if ($auth->isLoggedIn()) {
    $userType = $auth->getUserType();
    switch ($userType) {
        case 'admin':
        case 'staff':
            header("Location: admin/dashboard.php");
            break;
        case 'client':
            header("Location: client/dashboard.php");
            break;
    }
    exit();
}

// Handle login
if ($_POST && isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    if ($auth->login($username, $password)) {
        $userType = $auth->getUserType();
        switch ($userType) {
            case 'admin':
            case 'staff':
                header("Location: admin/dashboard.php");
                break;
            case 'client':
                header("Location: client/dashboard.php");
                break;
        }
        exit();
    } else {
        $error = "Invalid username or password";
    }
}

// Handle inquiry submission
if ($_POST && isset($_POST['submit_inquiry'])) {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "INSERT INTO inquiries (name, email, phone, address, subject, message) VALUES (:name, :email, :phone, :address, :subject, :message)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $_POST['inquiry_name']);
    $stmt->bindParam(':email', $_POST['inquiry_email']);
    $stmt->bindParam(':phone', $_POST['inquiry_phone']);
    $stmt->bindParam(':address', $_POST['inquiry_address']);
    $stmt->bindParam(':subject', $_POST['inquiry_subject']);
    $stmt->bindParam(':message', $_POST['inquiry_message']);
    
    if ($stmt->execute()) {
        $inquiry_success = "Thank you for your inquiry. We will get back to you soon.";
    } else {
        $inquiry_error = "There was an error submitting your inquiry. Please try again.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sanctuario de Santa Rosa de Lima Memorial Park</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="logo">
                <h1><i class="fas fa-cross"></i> Sanctuario de Santa Rosa de Lima</h1>
            </div>
            <nav>
                <button class="login-btn" onclick="openLoginModal()">
                    <i class="fas fa-sign-in-alt"></i> Client Login
                </button>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Sanctuario de Santa Rosa de Lima Memorial Park</h1>
            <p class="tagline">"COMFORT & ELEGANCE IN AFTERLIFE"</p>
            <a href="#plot-types" class="cta-button">Explore Our Services</a>
        </div>
    </section>

    <!-- Plot Types Section -->
    <section class="plot-types" id="plot-types">
        <div class="container">
            <h2 class="section-title">Our Memorial Services</h2>
            <div class="plot-grid">
                <div class="plot-card">
                    <h3><i class="fas fa-seedling"></i> Lawn Lots</h3>
                    <ul class="plot-specs">
                        <li><strong>Lot Area:</strong> 2.38 Square Meters</li>
                        <li><strong>Type:</strong> Underground Interment</li>
                        <li><strong>Tombstone:</strong> Flat on Ground</li>
                        <li><strong>Capacity:</strong> 1 fresh body & 4 set of bones</li>
                    </ul>
                    <button class="cta-button" onclick="openInquiryModal('Lawn Lots')">Inquire Now</button>
                </div>

                <div class="plot-card">
                    <h3><i class="fas fa-tree"></i> Garden Lots</h3>
                    <ul class="plot-specs">
                        <li><strong>Lot Area:</strong> 16 Square Meters</li>
                        <li><strong>Type:</strong> Underground Interment</li>
                        <li><strong>Tombstone:</strong> Flat on Ground</li>
                        <li><strong>Capacity:</strong> 2 fresh bodies & 8 set of bones</li>
                    </ul>
                    <button class="cta-button" onclick="openInquiryModal('Garden Lots')">Inquire Now</button>
                </div>

                <div class="plot-card">
                    <h3><i class="fas fa-monument"></i> Mini Mausoleum Lot</h3>
                    <ul class="plot-specs">
                        <li><strong>Lot Area:</strong> 21 Square Meters</li>
                        <li><strong>Type:</strong> Underground Structure</li>
                        <li><strong>Design:</strong> Uniform Exterior</li>
                        <li><strong>Capacity:</strong> 4 fresh bodies & 8 set of bones</li>
                    </ul>
                    <button class="cta-button" onclick="openInquiryModal('Mini Mausoleum Lot')">Inquire Now</button>
                </div>

                <div class="plot-card">
                    <h3><i class="fas fa-building"></i> Mausoleum Lot</h3>
                    <ul class="plot-specs">
                        <li><strong>Lot Area:</strong> 30 Square Meters</li>
                        <li><strong>Type:</strong> Optional Interment</li>
                        <li><strong>Design:</strong> Uniform Exterior</li>
                        <li><strong>Capacity:</strong> 2 fresh bodies & 10 set of bones</li>
                    </ul>
                    <button class="cta-button" onclick="openInquiryModal('Mausoleum Lot')">Inquire Now</button>
                </div>

                <div class="plot-card">
                    <h3><i class="fas fa-home"></i> Rental Apartment Niche</h3>
                    <ul class="plot-specs">
                        <li><strong>Area:</strong> 0.664 Square Meters</li>
                        <li><strong>Type:</strong> Above Ground Interment</li>
                        <li><strong>Payment:</strong> One Time Payment</li>
                        <li><strong>Capacity:</strong> 1 fresh body</li>
                    </ul>
                    <button class="cta-button" onclick="openInquiryModal('Rental Apartment Niche')">Inquire Now</button>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>About Sanctuario de Santa Rosa de Lima Memorial Park</h2>
                    <p>Sanctuario De Santa Rosa De Lima Memorial Park operates under La Rosario Villa and Development Corp., one of the Rising Real Estate Companies of the province. Sanctuario offers the municipality of Bacacay prime memorial lots and resting places.</p>
                    <p>We are committed to providing families with peaceful, dignified, and beautiful resting places for their loved ones, ensuring that memories are honored with the utmost respect and care.</p>
                </div>
                <div class="mission-vision">
                    <h3><i class="fas fa-heart"></i> Our Mission</h3>
                    <p>Sanctuario De Santa Rosa De Lima Memorial Park hopes to provide a solitude wherein hopes, healing and peace could be provided for the ones left behind by guaranteeing a tranquil resting place for their departed loved ones that would be regularly attended with care.</p>
                    
                    <h3><i class="fas fa-eye"></i> Our Vision</h3>
                    <p>Sanctuario De Santa Rosa De Lima Memorial Park aspires to be the municipality of Bacacay's most prestigious memorial park with spacious, peaceful and expansive space that would cater all the needs of the people, client or loved ones.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <div class="container">
            <h2 class="section-title">Contact Information</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Address</h3>
                    <p>2nd Floor, Rose Bldg, Brgy. 7<br>Magsaysay Ave. Bacacay, Albay</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <h3>Phone Numbers</h3>
                    <p>09454785649<br>09684412511</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <h3>Email</h3>
                    <p>lrdvc.sanctuario22@gmail.com</p>
                </div>
                <div class="contact-item">
                    <i class="fab fa-facebook"></i>
                    <h3>Facebook Page</h3>
                    <p>Sanctuario de Santa Rosa de Lima</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLoginModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">Client Login</h2>
            <?php if (isset($error)): ?>
                <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            <form method="POST">
                <div class="form-group">
                    <label for="username">Username or Email</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" name="login" class="login-form-btn">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>
            <p style="text-align: center; margin-top: 1rem; color: #7f8c8d;">
                Don't have an account? <a href="#" onclick="openInquiryModal('Account Registration')" style="color: #e74c3c;">Contact us</a>
            </p>
        </div>
    </div>

    <!-- Inquiry Modal -->
    <div id="inquiryModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeInquiryModal()">&times;</span>
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">Send Inquiry</h2>
            <?php if (isset($inquiry_success)): ?>
                <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $inquiry_success; ?>
                </div>
            <?php endif; ?>
            <?php if (isset($inquiry_error)): ?>
                <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <?php echo $inquiry_error; ?>
                </div>
            <?php endif; ?>
            <form method="POST">
                <div class="form-group">
                    <label for="inquiry_name">Full Name</label>
                    <input type="text" id="inquiry_name" name="inquiry_name" required>
                </div>
                <div class="form-group">
                    <label for="inquiry_email">Email</label>
                    <input type="email" id="inquiry_email" name="inquiry_email" required>
                </div>
                <div class="form-group">
                    <label for="inquiry_phone">Phone Number</label>
                    <input type="tel" id="inquiry_phone" name="inquiry_phone">
                </div>
                <div class="form-group">
                    <label for="inquiry_address">Address</label>
                    <input type="text" id="inquiry_address" name="inquiry_address">
                </div>
                <div class="form-group">
                    <label for="inquiry_subject">Subject</label>
                    <input type="text" id="inquiry_subject" name="inquiry_subject" required>
                </div>
                <div class="form-group">
                    <label for="inquiry_message">Message</label>
                    <textarea id="inquiry_message" name="inquiry_message" rows="4" style="width: 100%; padding: 0.8rem; border: 2px solid #ecf0f1; border-radius: 8px; font-family: inherit; resize: vertical;" required></textarea>
                </div>
                <button type="submit" name="submit_inquiry" class="login-form-btn">
                    <i class="fas fa-paper-plane"></i> Send Inquiry
                </button>
            </form>
        </div>
    </div>

    <script>
        function openLoginModal() {
            document.getElementById('loginModal').style.display = 'block';
        }

        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
        }

        function openInquiryModal(subject = '') {
            document.getElementById('inquiryModal').style.display = 'block';
            if (subject) {
                document.getElementById('inquiry_subject').value = 'Inquiry about ' + subject;
            }
            closeLoginModal();
        }

        function closeInquiryModal() {
            document.getElementById('inquiryModal').style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const loginModal = document.getElementById('loginModal');
            const inquiryModal = document.getElementById('inquiryModal');
            if (event.target == loginModal) {
                closeLoginModal();
            }
            if (event.target == inquiryModal) {
                closeInquiryModal();
            }
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Show login modal if there's an error
        <?php if (isset($error)): ?>
            openLoginModal();
        <?php endif; ?>

        // Show inquiry modal if there's a success/error message
        <?php if (isset($inquiry_success) || isset($inquiry_error)): ?>
            openInquiryModal();
        <?php endif; ?>
    </script>
</body>
</html>