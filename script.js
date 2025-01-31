// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing OTP handlers...');
    
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const teamPhone = document.getElementById('teamPhone');
    const otpInput = document.getElementById('otp');
    const otpGroup = document.getElementById('otpGroup');

    console.log('OTP elements:', {
        sendOtpBtn: !!sendOtpBtn,
        verifyOtpBtn: !!verifyOtpBtn,
        teamPhone: !!teamPhone,
        otpInput: !!otpInput,
        otpGroup: !!otpGroup
    });

    if (sendOtpBtn && teamPhone) {
        sendOtpBtn.addEventListener('click', async function() {
            const phone = teamPhone.value;
            console.log('Send OTP clicked for phone:', phone);
            
            if (!phone || phone.length !== 10) {
                showError('teamPhone', 'Please enter a valid 10-digit phone number');
                return;
            }

            try {
                sendOtpBtn.disabled = true;
                sendOtpBtn.textContent = 'Sending...';
                
                console.log('Sending OTP request...');
                const response = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone })
                });
                const data = await response.json();
                console.log('Server response:', data);
                
                if (data.success) {
                    otpGroup.style.display = 'block';
                    sendOtpBtn.textContent = 'Resend OTP';
                    showSuccess('teamPhone', 'OTP sent successfully');
                } else {
                    showError('teamPhone', data.error || data.message || 'Failed to send OTP');
                }
            } catch (error) {
                console.error('Frontend error:', error);
                showError('teamPhone', 'Failed to send OTP. Please try again.');
            } finally {
                sendOtpBtn.disabled = false;
                if (sendOtpBtn.textContent === 'Sending...') {
                    sendOtpBtn.textContent = 'Send OTP';
                }
            }
        });
    }

    if (verifyOtpBtn && otpInput) {
        verifyOtpBtn.addEventListener('click', async function() {
            const phone = teamPhone.value;
            const otp = otpInput.value;

            if (!otp || otp.length !== 6) {
                showError('otp', 'Please enter a valid 6-digit OTP');
                return;
            }

            try {
                verifyOtpBtn.disabled = true;
                verifyOtpBtn.textContent = 'Verifying...';
                
                const response = await fetch('/api/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone, otp })
                });
                const data = await response.json();
                console.log('Verification response:', data);
                
                if (data.success && data.verified) {
                    // Show success message
                    showSuccess('otp', 'Phone number verified successfully!');
                    
                    // Mark phone as verified
                    teamPhone.setAttribute('data-verified', 'true');
                    teamPhone.readOnly = true;
                    
                    // Update UI
                    otpGroup.style.display = 'none';
                    sendOtpBtn.style.display = 'none';
                    
                    // Add verified badge
                    const verifiedBadge = document.createElement('span');
                    verifiedBadge.className = 'verified-badge';
                    verifiedBadge.innerHTML = '&#10003; Verified';
                    verifiedBadge.style.color = 'green';
                    verifiedBadge.style.marginLeft = '10px';
                    teamPhone.parentElement.appendChild(verifiedBadge);
                } else {
                    showError('otp', data.message || 'Invalid OTP. Please try again.');
                    otpInput.value = ''; // Clear invalid OTP
                }
            } catch (error) {
                console.error('Verification error:', error);
                showError('otp', 'Failed to verify OTP. Please try again.');
            } finally {
                verifyOtpBtn.disabled = false;
                verifyOtpBtn.textContent = 'Verify OTP';
            }
        });
    }
});

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = element.parentElement.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = element.parentElement.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.color = 'green';
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }

    // Hide/Show Scroll Indicator
    if (window.scrollY > 300) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission Handler
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        }
    });
}

// Registration Form Handling
const registrationForm = document.getElementById('registrationForm');
const teamSizeSelect = document.getElementById('teamSize');
const playerDetailsContainer = document.getElementById('playerDetails');
const playerTemplate = document.getElementById('playerTemplate');

if (registrationForm && teamSizeSelect && playerDetailsContainer && playerTemplate) {
    // Handle team size selection
    teamSizeSelect.addEventListener('change', () => {
        const size = parseInt(teamSizeSelect.value);
        updatePlayerSections(size);
    });

    // Update player sections based on team size
    function updatePlayerSections(size) {
        playerDetailsContainer.innerHTML = '';
        
        for (let i = 1; i <= size; i++) {
            const playerSection = playerTemplate.content.cloneNode(true);
            const playerNumber = i === size && size === 5 ? 'Substitute' : i;
            
            // Update template placeholders
            playerSection.querySelector('h4').textContent = `Player ${playerNumber}`;
            
            const elements = playerSection.querySelectorAll('[name*="{n}"]');
            elements.forEach(element => {
                element.name = element.name.replace('{n}', i);
                if (i === size && size === 5) {
                    element.required = false; // Make substitute player fields optional
                }
            });

            playerDetailsContainer.appendChild(playerSection);
        }

        // Initialize file upload previews
        initializeFileUploads();
    }

    // File validation
    function validateFile(file) {
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }

        // Check file type (only images)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only JPEG, PNG, and GIF files are allowed';
        }

        return null; // No error
    }

    // Show error message
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'magical-error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(errorMessage);

        // Animate and remove after delay
        setTimeout(() => {
            errorMessage.classList.add('show');
        }, 100);

        setTimeout(() => {
            errorMessage.classList.remove('show');
            setTimeout(() => {
                errorMessage.remove();
            }, 500);
        }, 3000);
    }

    // Handle file uploads with preview
    function initializeFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const error = validateFile(file);
                    if (error) {
                        showError(error);
                        input.value = ''; // Clear the input
                        return;
                    }

                    const label = input.parentElement;
                    const uploadText = label.querySelector('.upload-text');
                    
                    // Create preview if it doesn't exist
                    let preview = label.querySelector('.file-preview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.className = 'file-preview';
                        label.appendChild(preview);
                    }

                    // Read and display the image
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.style.backgroundImage = `url(${e.target.result})`;
                        label.classList.add('has-preview');
                    };
                    reader.readAsDataURL(file);

                    // Update upload text
                    uploadText.innerHTML = `
                        <i class="${uploadText.querySelector('i').className}"></i>
                        <span class="filename">${file.name}</span>
                    `;
                    
                    // Add success class
                    label.classList.add('upload-success');
                }
            });
        });
    }

    // Phone number formatting
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '').slice(0, 10);
        if (value.length > 6) {
            value = value.slice(0, 6) + '-' + value.slice(6);
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        input.value = value;
    }

    // Initialize phone number formatting
    const phoneInput = document.getElementById('teamPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => formatPhoneNumber(e.target));
    }

    // Add loading animation to social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const icon = link.querySelector('i');
            icon.classList.add('fa-spin');
            setTimeout(() => {
                icon.classList.remove('fa-spin');
            }, 1000);
        });
    });

    // Form validation and submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        const requiredFields = registrationForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Get form data
        const formData = new FormData(registrationForm);

        try {
            // Show loading state
            const submitButton = registrationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <span class="button-text">
                    <i class="fas fa-spinner fa-spin"></i> Processing...
                </span>
            `;
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message with magical animation
            const successMessage = document.createElement('div');
            successMessage.className = 'magical-success-message';
            successMessage.innerHTML = `
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Registration Successful!</h3>
                    <p>Please check your email for payment instructions and join our Discord server for tournament updates.</p>
                </div>
            `;
            document.body.appendChild(successMessage);

            // Animate success message
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 100);

            // Reset form
            registrationForm.reset();
            updatePlayerSections(4); // Reset to default size

            // Remove success message after delay
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    successMessage.remove();
                }, 500);
            }, 5000);

            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

        } catch (error) {
            console.error('Error submitting registration:', error);
            alert('Sorry, there was an error processing your registration. Please try again.');
        }
    });

    // Initialize with default team size
    updatePlayerSections(4);
}

// Scroll Animation Handling
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const scrollProgress = document.querySelector('.scroll-progress');
    let currentSection = '';

    // Initialize Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update current section
                const section = entry.target.closest('[data-section]');
                if (section) {
                    currentSection = section.dataset.section;
                    updateScrollIndicator();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    // Observe all scroll elements
    scrollElements.forEach(el => observer.observe(el));

    // Update scroll progress bar
    function updateScrollProgress() {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrolled / maxScroll;
        scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // Update scroll indicator dots
    function updateScrollIndicator() {
        scrollDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === currentSection);
        });
    }

    // Smooth scroll to section when clicking dots
    scrollDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = document.querySelector(`[data-section="${dot.dataset.section}"]`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            updateScrollProgress();
        });
    });

    // Initial updates
    updateScrollProgress();
    updateScrollIndicator();
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
});

// Add stagger delay to player sections
function addStaggerDelay() {
    const playerSections = document.querySelectorAll('.player-section');
    playerSections.forEach((section, index) => {
        section.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Update player sections with stagger animation
const originalUpdatePlayerSections = updatePlayerSections;
function updatePlayerSections(size) {
    originalUpdatePlayerSections(size);
    addStaggerDelay();
}

// Add magical particle effect
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'magical-particle';
    
    const size = Math.random() * 5 + 2;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 2;
    const increment = size / duration;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        animation-duration: ${duration}s;
    `;
    
    document.querySelector('.magical-particles').appendChild(particle);
    
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

// Create particles periodically
setInterval(createParticle, 300);

// Animations on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.tournament-card, .timeline-item, .rule-card, .faq-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial styles for animated elements
    const elements = document.querySelectorAll('.tournament-card, .timeline-item, .rule-card, .faq-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger initial animation check
    animateOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Countdown Timer for Registration
const updateCountdown = () => {
    const deadline = new Date('2025-02-15T23:59:59+05:30').getTime();
    const now = new Date().getTime();
    const timeLeft = deadline - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update countdown display if element exists
        const countdownElement = document.querySelector('.registration-deadline');
        if (countdownElement) {
            countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }
};

// Update countdown every second
setInterval(updateCountdown, 1000);

// Prize Pool Counter Animation
const animatePrizePool = () => {
    const prizeAmount = document.querySelector('.prize-amount');
    if (!prizeAmount) return;

    const targetAmount = 100000;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetAmount / steps;
    let currentAmount = 0;
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        currentAmount += increment;
        
        if (currentStep === steps) {
            clearInterval(interval);
            prizeAmount.textContent = '₹' + targetAmount.toLocaleString();
        } else {
            prizeAmount.textContent = '₹' + Math.round(currentAmount).toLocaleString();
        }
    }, duration / steps);
};

// Initialize prize pool animation when element is in view
const observePrizePool = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animatePrizePool();
            observePrizePool.disconnect(); // Only animate once
        }
    });
});

const prizePool = document.querySelector('.prize-pool');
if (prizePool) {
    observePrizePool.observe(prizePool);
}
