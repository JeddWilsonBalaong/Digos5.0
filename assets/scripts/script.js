// RBD Financial Services - Enhanced JavaScript with Bootstrap 5.3 support

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile sidebar menu functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const sidebarMenu = document.querySelector('.modern-nav-menu');
    
    // Toggle sidebar menu
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });
    
    // Close sidebar when clicking on overlay
    navbarCollapse.addEventListener('click', function(e) {
        if (e.target === navbarCollapse) {
            navbarCollapse.classList.remove('show');
        }
    });
    
    // Close sidebar when clicking the close button (::before pseudo element)
    sidebarMenu.addEventListener('click', function(e) {
        const rect = sidebarMenu.getBoundingClientRect();
        const closeButtonArea = {
            x: rect.right - 55,
            y: rect.top + 15,
            width: 35,
            height: 35
        };
        
        if (e.clientX >= closeButtonArea.x && e.clientX <= closeButtonArea.x + closeButtonArea.width &&
            e.clientY >= closeButtonArea.y && e.clientY <= closeButtonArea.y + closeButtonArea.height) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Account for fixed navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile sidebar if open
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // Active navigation highlighting with Bootstrap nav-link class
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.classList.add('loaded');
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(30,60,114,0.95) 0%, rgba(42,82,152,0.95) 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Animate stats counters when they come into view
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-item h4');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = counter.innerText;
                const count = +counter.getAttribute('data-count') || 0;
                const inc = Math.ceil(parseInt(target.replace(/\D/g, '')) / speed);

                if (count < parseInt(target.replace(/\D/g, ''))) {
                    counter.setAttribute('data-count', count + inc);
                    counter.innerText = target.replace(/\d+/, count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .stats');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced button hover effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Tooltip initialization for Bootstrap components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Apply ripple effect to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize any Bootstrap components that need manual initialization
    // Carousel (if added later)
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
    });

    console.log('RBD Financial Services website loaded with Bootstrap 5.3 support');
});