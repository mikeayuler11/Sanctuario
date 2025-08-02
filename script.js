// DOM Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const authButtons = document.querySelector('.auth-buttons');

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Initialize form validation
    initializeFormValidation();
    
    // Initialize mobile menu
    initializeMobileMenu();
});

// Mobile Menu Functions
function initializeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            authButtons.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                authButtons.classList.remove('active');
            });
        });
    }
}

// Modal Functions
function openLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Focus on first input
    setTimeout(() => {
        const firstInput = loginModal.querySelector('input[type="email"]');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    clearFormErrors(loginModal);
    resetForm(loginModal);
}

function openSignupModal() {
    signupModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Focus on first input
    setTimeout(() => {
        const firstInput = signupModal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeSignupModal() {
    signupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    clearFormErrors(signupModal);
    resetForm(signupModal);
}

function switchToSignup() {
    closeLoginModal();
    setTimeout(() => openSignupModal(), 150);
}

function switchToLogin() {
    closeSignupModal();
    setTimeout(() => openLoginModal(), 150);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (loginModal.style.display === 'block') {
            closeLoginModal();
        }
        if (signupModal.style.display === 'block') {
            closeSignupModal();
        }
    }
});

// Form Validation Functions
function initializeFormValidation() {
    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const passwordInput = document.getElementById('signupPassword');
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
        passwordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Password validation
    else if (fieldType === 'password' && fieldName === 'password' && value) {
        if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters long';
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
            errorMessage = 'Password must contain at least one uppercase and one lowercase letter';
            isValid = false;
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const confirmField = document.getElementById('signupConfirmPassword');

    clearFieldError(confirmField);

    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmField, 'Passwords do not match');
        return false;
    }
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e0e0e0';
    field.style.boxShadow = 'none';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearFormErrors(modal) {
    const errors = modal.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#e0e0e0';
        input.style.boxShadow = 'none';
    });
}

function resetForm(modal) {
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

// Form Submission Handlers
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate form
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showFormMessage(form, 'Please correct the errors above.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        console.log('Login attempt:', { email, password, remember });
        
        // Simulate successful login
        if (email && password) {
            showFormMessage(form, 'Login successful! Welcome back.', 'success');
            
            // Store user session (in real app, this would be handled securely)
            if (remember) {
                localStorage.setItem('rememberedUser', email);
            }
            
            setTimeout(() => {
                closeLoginModal();
                showNotification('Welcome back! You have been successfully logged in.', 'success');
                // Redirect or update UI for logged-in state
                updateUIForLoggedInUser(email);
            }, 1500);
        } else {
            showFormMessage(form, 'Invalid email or password. Please try again.', 'error');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validate form
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validate password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!terms) {
        showFormMessage(form, 'Please accept the Terms of Service and Privacy Policy.', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        showFormMessage(form, 'Please correct the errors above.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        console.log('Signup attempt:', { firstName, lastName, email, phone, password });
        
        // Simulate successful signup
        if (email && password && firstName && lastName) {
            showFormMessage(form, 'Account created successfully! Welcome to our community.', 'success');
            
            setTimeout(() => {
                closeSignupModal();
                showNotification('Welcome! Your account has been created successfully.', 'success');
                // Redirect or update UI for logged-in state
                updateUIForLoggedInUser(email);
            }, 1500);
        } else {
            showFormMessage(form, 'An error occurred. Please try again.', 'error');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showFormMessage(form, message, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontSize = '0.9rem';
    messageDiv.style.textAlign = 'center';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '3000';
    notification.style.maxWidth = '400px';
    notification.style.fontSize = '0.9rem';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
        notification.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
        notification.style.border = '1px solid #f5c6cb';
    } else {
        notification.style.backgroundColor = '#d1ecf1';
        notification.style.color = '#0c5460';
        notification.style.border = '1px solid #bee5eb';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function updateUIForLoggedInUser(email) {
    // In a real application, you would update the UI to show the user is logged in
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span class="user-email">${email}</span>
                <button class="btn btn-secondary" onclick="handleLogout()">Logout</button>
            </div>
        `;
    }
}

function handleLogout() {
    // Clear user session
    localStorage.removeItem('rememberedUser');
    
    // Reset UI
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-secondary" onclick="openLoginModal()">Login</button>
            <button class="btn btn-primary" onclick="openSignupModal()">Create Account</button>
        `;
    }
    
    showNotification('You have been successfully logged out.', 'info');
}

// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const phone = formData.get('phone') || this.querySelector('input[type="tel"]').value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                console.log('Contact form submission:', { name, email, phone, message });
                showNotification('Thank you for your message. We will get back to you soon.', 'success');
                this.reset();
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Check for remembered user on page load
document.addEventListener('DOMContentLoaded', function() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        updateUIForLoggedInUser(rememberedUser);
    }
});