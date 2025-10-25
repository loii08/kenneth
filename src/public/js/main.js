class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupDarkMode();
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupActiveSection();
        this.setupBackToTopButton();
        this.setupScrollEffects();
        this.setupTypewriterAnimation();
        this.setupProjectFilter();
    }

    setupDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }

        toggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        const menuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        const iconMenu = document.getElementById('icon-menu');
        const iconClose = document.getElementById('icon-close');

        if (menuButton && mobileMenu && iconMenu && iconClose) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                iconMenu.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            });
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const iconMenu = document.getElementById('icon-menu');
        const iconClose = document.getElementById('icon-close');
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && iconMenu && iconClose) {
            mobileMenu.classList.add('hidden');
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
        }
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerCallback = (entries) => {
            const intersectingEntries = entries.filter(e => e.isIntersecting);
            const lastIntersecting = intersectingEntries.at(-1);

            if (!lastIntersecting) return;

            const currentSectionId = lastIntersecting.target.getAttribute('id');
            
            navLinks.forEach(link => {
                const sectionForLink = link.getAttribute('data-section');
                link.classList.toggle('active', sectionForLink === currentSectionId);
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0,
            rootMargin: '-80px 0px -65% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    setupScrollEffects() {
        const header = document.querySelector('header');
        const sentinel = document.getElementById('header-sentinel');

        if (!header || !sentinel) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                header.classList.toggle('shadow-lg', !entry.isIntersecting);
            });
        }, {
            rootMargin: '-80px 0px 0px 0px'
        });

        observer.observe(sentinel);
    }

    setupBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTopBtn');
        const scrollSentinel = document.getElementById('back-to-top-sentinel');
        if (!backToTopBtn || !scrollSentinel) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    backToTopBtn.classList.add('hidden');
                } else {
                    backToTopBtn.classList.remove('hidden');
                }
            });
        });

        observer.observe(scrollSentinel);

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupBlogModal() {
        const modal = document.getElementById('blogModal');
        const modalContent = document.getElementById('blogModalContent');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const readMoreBtns = document.querySelectorAll('.read-more-btn');

        if (!modal || !closeModalBtn || readMoreBtns.length === 0) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalDate = document.getElementById('modalDate');
        const modalBody = document.getElementById('modalBody');

        const openModal = (title, date, excerpt) => {
            modalTitle.textContent = title;
            modalDate.textContent = date;
            modalBody.innerHTML = `<p>${excerpt}</p><p class="mt-4">Full content would appear here in a complete implementation.</p>`;
            
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        };

        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';
            setTimeout(() => modal.classList.add('hidden'), 300);
        };

        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const { title, date, excerpt } = btn.dataset;
                openModal(title, date, excerpt);
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal()); 

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    setupProjectFilter() {
        const filterContainer = document.getElementById('project-filters');
        if (!filterContainer) return;

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) return;

            const filterValue = e.target.dataset.filter;

            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('hidden-card');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });

        setTimeout(() => {
            document.getElementById('project-gallery').style.opacity = '1';
        }, 100);
    }
}

PortfolioApp.prototype.setupTypewriterAnimation = function() {
    const target = document.getElementById('typewriter-text');
    if (!target) return;

    const roles = ['Virtual Assistant', 'Graphic Designer', 'Video Editor', 'Web Designer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentRole = roles[roleIndex];
        let text = '';

        if (isDeleting) {
            text = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            text = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        target.textContent = text;

        let typeSpeed = 150;
        if (isDeleting) {
            typeSpeed /= 3; // Backspace faster
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 1000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    };

    type();
};

let appInstance;
document.addEventListener('DOMContentLoaded', () => {
    appInstance = new PortfolioApp();
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded'); // Start the fade-out transition
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
            
        });
    }
});