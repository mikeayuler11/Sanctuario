// Cemetery Management System - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initAnimations();
    initModals();
    initForms();
    initSidebar();
    initTables();
    initCharts();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add specific animations based on class
                if (entry.target.classList.contains('animate-fadeIn')) {
                    entry.target.style.animation = 'fadeIn 0.8s ease-out';
                }
                if (entry.target.classList.contains('animate-slideInLeft')) {
                    entry.target.style.animation = 'slideInLeft 0.8s ease-out';
                }
                if (entry.target.classList.contains('animate-slideInRight')) {
                    entry.target.style.animation = 'slideInRight 0.8s ease-out';
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-fadeIn, .animate-slideInLeft, .animate-slideInRight').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Modal functionality
function initModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Form enhancements
function initForms() {
    // Add floating label effect
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if already has value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = 'This field is required';
                error.style.color = '#e74c3c';
                error.style.fontSize = '0.875rem';
                error.style.marginTop = '0.25rem';
                field.parentElement.appendChild(error);
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    });
    
    return isValid;
}

// Sidebar functionality
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Update active menu item
    updateActiveMenuItem();
}

function updateActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
}

// Table enhancements
function initTables() {
    // Add search functionality
    document.querySelectorAll('.table-search').forEach(searchInput => {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.table-container').querySelector('table');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });

    // Add sorting functionality
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const columnIndex = Array.from(this.parentElement.children).indexOf(this);
            const isAscending = this.classList.contains('sort-asc');
            
            // Remove existing sort classes
            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Add new sort class
            this.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
            
            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[columnIndex].textContent.trim();
                const bValue = b.children[columnIndex].textContent.trim();
                
                const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
                return isAscending ? -comparison : comparison;
            });
            
            // Reorder rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// Chart initialization (using Chart.js if available)
function initCharts() {
    if (typeof Chart !== 'undefined') {
        // Dashboard charts
        initDashboardCharts();
    }
}

function initDashboardCharts() {
    // Burial statistics chart
    const burialCtx = document.getElementById('burialChart');
    if (burialCtx) {
        new Chart(burialCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fresh Bodies', 'Bones'],
                datasets: [{
                    data: [65, 35],
                    backgroundColor: ['#3498db', '#e74c3c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
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
                    backgroundColor: '#27ae60'
                }, {
                    label: 'Available',
                    data: [8, 12, 15, 17, 5],
                    backgroundColor: '#95a5a6'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                min-width: 300px;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show { transform: translateX(0); }
            .notification-info { background: #3498db; color: white; }
            .notification-success { background: #27ae60; color: white; }
            .notification-warning { background: #f39c12; color: white; }
            .notification-error { background: #e74c3c; color: white; }
            .notification-content { display: flex; justify-content: space-between; align-items: center; }
            .notification-close { background: none; border: none; color: inherit; font-size: 1.5rem; cursor: pointer; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Export functions for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;