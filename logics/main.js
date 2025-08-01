// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
});

function initializeWebsite() {
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeTabSystem();
    initializeSmoothScrollSnapping();
    enhanceExperience();
}

// Global variables
let sections;

function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    }
}

// Smooth Scroll Snapping
function initializeSmoothScrollSnapping() {
    sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 1000;

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

    function handleWheel(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;
        lastScrollTime = now;

        if (e.deltaY > 0) {
            scrollToSection(currentSectionIndex + 1);
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            scrollToSection(currentSectionIndex - 1);
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
    }

    // Handle touch events for mobile
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        e.preventDefault();
    }

    function handleTouchEnd(e) {
        const touchEndY = e.changedTouches[0].clientY;
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

    currentSectionIndex = getCurrentSection();

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    window.addEventListener('resize', () => {
        currentSectionIndex = getCurrentSection();
    });

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
                if (loadingProgress) loadingProgress.style.opacity = '0';
            }, 200);
        }
        if (loadingProgress) loadingProgress.style.width = width + '%';
    }, 100);
}

// Navigation System
function initializeNavigation() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

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

    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (readingProgress) {
            requestAnimationFrame(() => {
                const progress = (scrolled / docHeight) * 100;
                readingProgress.style.width = `${progress}%`;
                
                if (scrolled > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                updateActiveSection(scrolled);
            });
        }
    }, 10);

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

// Progressive Enhancement
function enhanceExperience() {
    if (CSS.supports('backdrop-filter', 'blur(10px)')) {
        document.body.classList.add('supports-backdrop-filter');
    }

    if ('IntersectionObserver' in window) {
        initializeIntersectionObserver();
    }

    handleContentErrors();
}

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

function handleContentErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', (e) => {
            e.target.classList.add('image-error');
            e.target.parentElement.classList.add('error-container');
            
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
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
            });
            
            const targetContent = document.querySelector(`#${tab.dataset.tab}`);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                    targetContent.style.opacity = '1';
                }, 200);
            }
        });

        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });
}