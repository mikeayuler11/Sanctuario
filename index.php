<?php
require_once 'includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo getSetting('site_name'); ?></title>
    <meta name="description" content="<?php echo getSetting('site_tagline'); ?>">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- AOS Animation -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#home">
                <i class="fas fa-cross me-2"></i>
                Sanctuario
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#services">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contact">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-outline-light btn-sm ms-2" href="client/login.php">Client Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-primary btn-sm ms-2" href="admin/login.php">Admin Login</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Panel 1: Landing Panel -->
    <section id="home" class="hero-section">
        <div class="hero-background"></div>
        <div class="container">
            <div class="row min-vh-100 align-items-center">
                <div class="col-lg-8 mx-auto text-center text-white">
                    <h1 class="display-3 fw-bold mb-4" data-aos="fade-up">
                        Sanctuario de Santa Rosa de Lima Memorial Park
                    </h1>
                    <p class="lead mb-5" data-aos="fade-up" data-aos-delay="200">
                        <?php echo getSetting('site_tagline'); ?>
                    </p>
                    <div class="hero-buttons" data-aos="fade-up" data-aos-delay="400">
                        <a href="#services" class="btn btn-primary btn-lg me-3">Our Services</a>
                        <a href="#contact" class="btn btn-outline-light btn-lg">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Panel 2: Services Offered -->
    <section id="services" class="py-5 bg-light">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-5 fw-bold" data-aos="fade-up">Our Services</h2>
                    <p class="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                        Choose from our premium burial lot options
                    </p>
                </div>
            </div>
            <div class="row g-4">
                <?php
                $db = getDB();
                $stmt = $db->query("SELECT * FROM plot_types WHERE is_active = 1 ORDER BY price");
                $plotTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($plotTypes as $index => $plotType):
                ?>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="<?php echo $index * 100; ?>">
                    <div class="card service-card h-100 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="service-icon mb-3">
                                <i class="fas fa-cross fa-3x text-primary"></i>
                            </div>
                            <h5 class="card-title fw-bold"><?php echo $plotType['name']; ?></h5>
                            <div class="service-details">
                                <p class="text-muted mb-2">
                                    <i class="fas fa-ruler-combined me-2"></i>
                                    LOT AREA: <?php echo $plotType['area']; ?> sqm
                                </p>
                                <p class="text-muted mb-2">
                                    <i class="fas fa-arrow-down me-2"></i>
                                    <?php echo ucfirst(str_replace('_', ' ', $plotType['interment_type'])); ?> Interment
                                </p>
                                <p class="text-muted mb-2">
                                    <i class="fas fa-tombstone me-2"></i>
                                    <?php echo $plotType['tombstone_type']; ?>
                                </p>
                                <p class="text-muted mb-3">
                                    <i class="fas fa-users me-2"></i>
                                    Capacity: <?php echo $plotType['capacity_fresh']; ?> fresh body & <?php echo $plotType['capacity_bones']; ?> sets of bones
                                </p>
                                <div class="price-tag">
                                    <span class="badge bg-primary fs-6"><?php echo formatCurrency($plotType['price']); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Panel 3: About the Memorial Park -->
    <section id="about" class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-5 fw-bold" data-aos="fade-up">About Us</h2>
                    <p class="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                        Sanctuario De Santa Rosa De Lima Memorial Park operates under La Rosario Villa and Development Corp., 
                        a rising real estate company in Albay. It offers premium memorial lots and services in Bacacay.
                    </p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-lg-6" data-aos="fade-right">
                    <div class="about-card h-100 p-4 bg-primary text-white rounded">
                        <div class="text-center mb-4">
                            <i class="fas fa-bullseye fa-3x"></i>
                        </div>
                        <h4 class="fw-bold mb-3">Our Mission</h4>
                        <p class="mb-0">
                            <?php echo getSetting('mission'); ?>
                        </p>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left">
                    <div class="about-card h-100 p-4 bg-secondary text-white rounded">
                        <div class="text-center mb-4">
                            <i class="fas fa-eye fa-3x"></i>
                        </div>
                        <h4 class="fw-bold mb-3">Our Vision</h4>
                        <p class="mb-0">
                            <?php echo getSetting('vision'); ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Panel 4: Inquiry Section -->
    <section id="inquiry" class="py-5 bg-light">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-5 fw-bold" data-aos="fade-up">Send Us an Inquiry</h2>
                    <p class="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                        We're here to help you with any questions about our services
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow" data-aos="fade-up">
                        <div class="card-body p-4">
                            <form id="inquiryForm" method="POST" action="process_inquiry.php">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="name" class="form-label">Full Name *</label>
                                        <input type="text" class="form-control" id="name" name="name" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="email" class="form-label">Email Address *</label>
                                        <input type="email" class="form-control" id="email" name="email" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="phone" name="phone">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="subject" class="form-label">Subject *</label>
                                        <input type="text" class="form-control" id="subject" name="subject" required>
                                    </div>
                                    <div class="col-12">
                                        <label for="message" class="form-label">Message *</label>
                                        <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
                                    </div>
                                    <div class="col-12 text-center">
                                        <button type="submit" class="btn btn-primary btn-lg">
                                            <i class="fas fa-paper-plane me-2"></i>
                                            Send Inquiry
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Panel 5: Contact Information -->
    <section id="contact" class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-5 fw-bold" data-aos="fade-up">Contact Information</h2>
                    <p class="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                        Get in touch with us for any inquiries
                    </p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="contact-card text-center p-4">
                        <div class="contact-icon mb-3">
                            <i class="fas fa-map-marker-alt fa-2x text-primary"></i>
                        </div>
                        <h5 class="fw-bold">Address</h5>
                        <p class="text-muted mb-0"><?php echo getSetting('contact_address'); ?></p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="contact-card text-center p-4">
                        <div class="contact-icon mb-3">
                            <i class="fas fa-phone fa-2x text-primary"></i>
                        </div>
                        <h5 class="fw-bold">Phone</h5>
                        <p class="text-muted mb-0"><?php echo getSetting('contact_phone'); ?></p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="contact-card text-center p-4">
                        <div class="contact-icon mb-3">
                            <i class="fas fa-envelope fa-2x text-primary"></i>
                        </div>
                        <h5 class="fw-bold">Email</h5>
                        <p class="text-muted mb-0"><?php echo getSetting('contact_email'); ?></p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="contact-card text-center p-4">
                        <div class="contact-icon mb-3">
                            <i class="fab fa-facebook fa-2x text-primary"></i>
                        </div>
                        <h5 class="fw-bold">Facebook</h5>
                        <p class="text-muted mb-0"><?php echo getSetting('facebook_page'); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>Sanctuario de Santa Rosa de Lima</h5>
                    <p class="mb-0">Comfort & Elegance in Afterlife</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">&copy; <?php echo date('Y'); ?> All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AOS Animation -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
</body>
</html>