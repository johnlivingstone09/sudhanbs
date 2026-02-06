// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.intro-text, .service-card, .highlight-card, .stat-card, .feature-card, .mission-card, .process-step');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 40);
    }

    // Staggered animation for all cards
    const allCards = document.querySelectorAll('.service-card, .highlight-card, .stat-card, .feature-card, .mission-card, .process-step');
    allCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Staggered animation for intro text
    const introTexts = document.querySelectorAll('.intro-text');
    introTexts.forEach((text, index) => {
        text.style.transitionDelay = `${index * 0.3}s`;
    });

    // Notification Function
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#71C00B' : '#dc3545'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Contact Form Handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Initialize EmailJS
        emailjs.init('9wTxyWcA5euVtVQaO');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const mobile = formData.get('mobile').trim();
            const address = formData.get('address').trim();
            const message = formData.get('message').trim();

            // Validation
            if (!name || !email || !mobile || !address || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Mobile validation (10 digits)
            if (!/^[0-9]{10}$/.test(mobile)) {
                showNotification('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            // Email validation
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show sending message
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            // EmailJS template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                mobile: mobile,
                address: address,
                message: message
            };

            // Send email using EmailJS
            emailjs.send('service_foa3csx', 'template_mthbem8', templateParams)
                .then(function(response) {
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                    // Remove focused class from form groups
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('focused');
                    });
                }, function(error) {
                    showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                })
                .finally(function() {
                    // Reset button
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                });
        });
    }

    // Form Input Animation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on page load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Button Hover Effects
    const buttons = document.querySelectorAll('.cta-button, .submit-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Service Card Hover Effects
    const cards = document.querySelectorAll('.service-card, .highlight-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Footer Links Hover Animation
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Social Links Hover Animation
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : 'var(--accent-yellow)'};
            color: ${type === 'success' ? 'white' : 'var(--text-black)'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Add to body
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // EMI Calculator Functionality
    const loanAmountSlider = document.getElementById('loanAmount');
    const interestRateSlider = document.getElementById('interestRate');
    const loanTenureSlider = document.getElementById('loanTenure');
    
    const loanAmountDisplay = document.getElementById('loanAmountDisplay');
    const interestRateDisplay = document.getElementById('interestRateDisplay');
    const loanTenureDisplay = document.getElementById('loanTenureDisplay');
    
    const monthlyEMIDisplay = document.getElementById('monthlyEMI');
    const principalAmountDisplay = document.getElementById('principalAmount');
    const totalInterestDisplay = document.getElementById('totalInterest');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const pieChart = document.getElementById('pieChart');

    if (loanAmountSlider && interestRateSlider && loanTenureSlider) {
        // Format number with commas
        function formatNumber(num) {
            return new Intl.NumberFormat('en-IN').format(num);
        }

        // Update slider colors
        function updateSliderColor(slider) {
            const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.setProperty('--slider-percent', value + '%');
            slider.style.background = `linear-gradient(to right, var(--primary-green) 0%, var(--primary-green) ${value}%, #ddd ${value}%, #ddd 100%)`;
        }

        // Calculate EMI
        function calculateEMI() {
            const principal = parseFloat(loanAmountSlider.value);
            const rate = parseFloat(interestRateSlider.value) / 100 / 12; // Monthly rate
            const tenure = parseFloat(loanTenureSlider.value) * 12; // Months

            let emi = 0;
            if (rate > 0) {
                emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
            } else {
                emi = principal / tenure;
            }

            const totalAmount = emi * tenure;
            const totalInterest = totalAmount - principal;

            // Update displays
            loanAmountDisplay.textContent = formatNumber(principal);
            interestRateDisplay.textContent = parseFloat(interestRateSlider.value).toFixed(1);
            loanTenureDisplay.textContent = loanTenureSlider.value;
            
            monthlyEMIDisplay.textContent = '₹' + formatNumber(Math.round(emi));
            principalAmountDisplay.textContent = '₹' + formatNumber(principal);
            totalInterestDisplay.textContent = '₹' + formatNumber(Math.round(totalInterest));
            totalAmountDisplay.textContent = '₹' + formatNumber(Math.round(totalAmount));

            // Update pie chart
            updatePieChart(principal, totalInterest);
        }

        // Update pie chart
        function updatePieChart(principal, interest) {
            const total = principal + interest;
            const principalPercentage = (principal / total) * 360;
            const interestPercentage = (interest / total) * 360;

            if (pieChart) {
                pieChart.style.background = `conic-gradient(
                    var(--accent-yellow) 0deg ${principalPercentage}deg,
                    var(--dark-green) ${principalPercentage}deg ${principalPercentage + interestPercentage}deg
                )`;
            }
        }

        // Event listeners
        loanAmountSlider.addEventListener('input', function() {
            updateSliderColor(this);
            calculateEMI();
        });
        interestRateSlider.addEventListener('input', function() {
            updateSliderColor(this);
            calculateEMI();
        });
        loanTenureSlider.addEventListener('input', function() {
            updateSliderColor(this);
            calculateEMI();
        });

        // Initial calculation and colors
        updateSliderColor(loanAmountSlider);
        updateSliderColor(interestRateSlider);
        updateSliderColor(loanTenureSlider);
        calculateEMI();
    }

    // Page Load Animation
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Preloader (optional)
    const preloader = document.createElement('div');
    preloader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid var(--light-bg);
                border-top: 3px solid var(--primary-green);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(preloader);

    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });

    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });

    // Performance Optimization
    let ticking = false;
    function updateOnScroll() {
        // Throttle scroll events
        if (!ticking) {
            requestAnimationFrame(function() {
                // Add any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateOnScroll);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}