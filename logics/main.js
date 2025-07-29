// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all major components
    // Initialize all major components
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeTabSystem();
    initializeParallaxScrolling();
    initializePerformanceMonitoring();
    initializeSmoothScrollSnapping();
    enhanceExperience();
    initializePortfolioFilters();
    initializePortfolioNavigation();
}

// Global variables and functions
let sections;
function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    }
}

// Smooth Scroll Snapping
function initializeSmoothScrollSnapping() {
    let isScrolling = false;
    sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 1000; // 1 second cooldown between scrolls

    // Get the initial active section
    function getCurrentSection() {
        const viewportMiddle = window.scrollY + (window.innerHeight / 2);
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
                return i;
            }
        }
        return 0;
    }

    // Handle wheel events for smooth scrolling
    function handleWheel(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;
        lastScrollTime = now;

        if (e.deltaY > 0) {
            // Scrolling down
            scrollToSection(currentSectionIndex + 1);
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            // Scrolling up
            scrollToSection(currentSectionIndex - 1);
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
    }

    // Handle touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        e.preventDefault();
    }

    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;
        
        const swipeDistance = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            lastScrollTime = now;
            if (swipeDistance > 0) {
                scrollToSection(currentSectionIndex + 1);
                currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
            } else {
                scrollToSection(currentSectionIndex - 1);
                currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
            }
        }
    }

    // Initialize
    currentSectionIndex = getCurrentSection();

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Handle resize events
    window.addEventListener('resize', () => {
        currentSectionIndex = getCurrentSection();
    });

    // Initial setup
    sections.forEach(section => {
        section.style.scrollSnapAlign = 'start';
        section.style.scrollSnapStop = 'always';
    });
}

// Loading System
function initializeLoading() {
    const loadingProgress = document.querySelector('.loading-progress');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 30;
        if (width > 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.body.classList.add('loading-complete');
                loadingProgress.style.opacity = '0';
            }, 200);
        }
        loadingProgress.style.width = width + '%';
    }, 100);
}

// Navigation System
function initializeNavigation() {
    const nav = document.querySelector('nav');
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(0);
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const readingProgress = document.querySelector('.reading-progress');

    // Debounce function for performance
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

    // Handle scroll events
    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update reading progress
        if (readingProgress) {
            requestAnimationFrame(() => {
                const progress = (scrolled / docHeight) * 100;
                readingProgress.style.width = `${progress}%`;
                
                // Update navbar
                if (scrolled > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                // Update active section
                updateActiveSection(scrolled);
            });
        }
    }, 10);

    // Initialize Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Update active section
function updateActiveSection(scrollPos) {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            section.classList.add('active-section');
        } else {
            section.classList.remove('active-section');
        }
    });
}

// Parallax Scrolling
function initializeParallaxScrolling() {
    const elements = document.querySelectorAll('.parallax');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                elements.forEach(el => {
                    const speed = el.dataset.speed || 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const paint = performance.getEntriesByType('paint');
            const navigation = performance.getEntriesByType('navigation')[0];
            
            // Log performance metrics
            console.log(`First Paint: ${paint[0].startTime}ms`);
            console.log(`First Contentful Paint: ${paint[1].startTime}ms`);
            console.log(`DOM Interactive: ${navigation.domInteractive}ms`);
            console.log(`Load Complete: ${navigation.loadEventEnd}ms`);
        });
    }
}

// Progressive Enhancement
function enhanceExperience() {
    // Check for modern CSS features
    if (CSS.supports('backdrop-filter', 'blur(10px)')) {
        document.body.classList.add('supports-backdrop-filter');
    }

    // Initialize Intersection Observer if supported
    if ('IntersectionObserver' in window) {
        initializeIntersectionObserver();
    }

    // Handle content errors
    handleContentErrors();
}

// Intersection Observer Implementation
function initializeIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Error Handling
function handleContentErrors() {
    // Image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', (e) => {
            e.target.classList.add('image-error');
            e.target.parentElement.classList.add('error-container');
            
            // Add fallback content
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 7h.01M7 3h10c.94 0 1.8.5 2.27 1.31l3.58 6.49a2.5 2.5 0 0 1 0 2.4l-3.58 6.49A2.5 2.5 0 0 1 17 21H7a2.5 2.5 0 0 1-2.27-1.31l-3.58-6.49a2.5 2.5 0 0 1 0-2.4l3.58-6.49A2.5 2.5 0 0 1 7 3z"/>
                </svg>
                <span>Image unavailable</span>
            `;
            e.target.parentElement.appendChild(fallback);
        });
    });

    // Resource loading error handling
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
            console.error('Resource loading failed:', e.target.src || e.target.href);
        }
    }, true);
}

// Tab System
function initializeTabSystem() {
    const tabs = document.querySelectorAll('.header-item');
    const tabContents = document.querySelectorAll('.experience-list');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
            });
            
            // Show selected tab content
            const targetContent = document.querySelector(`#${tab.dataset.tab}`);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                    targetContent.style.opacity = '1';
                }, 200);
            }
        });

        // Add keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });
}

// Add this function to your main.js
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const mobileItems = document.querySelectorAll('.portfolio-mobile-item');

    // Initial check to ensure elements exist
    if (!filterButtons.length) {
        console.log('Filter buttons not found');
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            // Get the filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter desktop items
            if (portfolioItems.length) {
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            }

            // Filter mobile items
            if (mobileItems.length) {
                mobileItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

function initializePortfolioNavigation() {
    const gallery = document.querySelector('.portfolio-gallery');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const itemsPerPage = 6;
    let currentPage = 0;
    let totalPages = Math.ceil(items.length / itemsPerPage);
    let visibleItems = [];

    function updateVisibility() {
    // Remove active class from all items first
    items.forEach(item => {
        item.classList.remove('active');
    });

    // Calculate visible items based on current filter
    visibleItems = Array.from(items).filter(item => {
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        return currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
    });

    // Update total pages
    totalPages = Math.ceil(visibleItems.length / itemsPerPage);

    // Show current page items by adding active class
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = visibleItems.slice(start, end);
    
    itemsToShow.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('active');
        }, index * 100);
    });

    // Update navigation buttons
    prevBtn.classList.toggle('hidden', currentPage === 0);
    nextBtn.classList.toggle('hidden', currentPage >= totalPages - 1 || visibleItems.length <= itemsPerPage);
    }
    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateVisibility();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateVisibility();
        }
    });

    // Modify the existing filter click handlers
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPage = 0; // Reset to first page when changing filters
            updateVisibility();
        });
    });

    // Initial setup
    updateVisibility();
}