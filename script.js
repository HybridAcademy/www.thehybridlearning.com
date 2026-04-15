/**
 * script.js - Interactive UI Elements for Hybrid Academy
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Header & ScrollSpy --- */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ScrollSpy - Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- 2. Mobile Menu Toggle --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle && navbar) {
        const toggleIcon = mobileToggle.querySelector('i');

        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            // Change icon
            if (navbar.classList.contains('active')) {
                toggleIcon.classList.remove('bx-menu-alt-right');
                toggleIcon.classList.add('bx-x');
            } else {
                toggleIcon.classList.remove('bx-x');
                toggleIcon.classList.add('bx-menu-alt-right');
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                toggleIcon.classList.remove('bx-x');
                toggleIcon.classList.add('bx-menu-alt-right');
            });
        });
    }

    /* --- 3. Scroll Animations (Intersection Observer) --- */
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* --- 4. FAQ Accordion --- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    /* --- 5. Testimonial Slider --- */
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        let slideInterval;

        // Create dots dynamically based on number of slides
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const goToSlide = (n) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            goToSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            goToSlide(currentSlide - 1);
        };

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        // Event Listeners for manual controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }

        // Initialize auto-rotation
        startInterval();
    }

    /* --- 6. Form Submission Handling --- */
    const tuitionForm = document.getElementById('tuition-form');

    if (tuitionForm) {
        tuitionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const parentName = document.getElementById('parentName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;

            fetch('https://formsubmit.co/ajax/contacthybridacademy@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: parentName,
                    email: email,
                    phone: phone,
                    subject_requested: subject,
                    _subject: `New Tuition Request: ${subject}`,
                    _captcha: 'false'
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    const messageEl = document.getElementById('form-message');
                    messageEl.textContent = 'Thank you! Your request has been sent. We will contact you shortly.';
                    messageEl.className = 'form-message success';
                    messageEl.classList.remove('hidden');

                    this.reset();

                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        messageEl.classList.add('hidden');
                    }, 5000);
                })
                .catch(error => {
                    const messageEl = document.getElementById('form-message');
                    messageEl.textContent = 'Oops! There was a problem submitting your request. Please check your internet connection.';
                    messageEl.className = 'form-message';
                    messageEl.style.color = '#EF4444';
                    messageEl.classList.remove('hidden');

                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    /* --- 7. Promotional Modal Logic --- */
    const promoModal = document.getElementById('promo-modal');
    const closePromoBtn = document.getElementById('close-promo');

    if (promoModal && closePromoBtn) {
        // Show modal on load
        setTimeout(() => {
            promoModal.classList.add('active');
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                promoModal.classList.remove('active');
            }, 10000);
        }, 800); // 0.8s delay to let page load first

        // Close on button click
        closePromoBtn.addEventListener('click', () => {
            promoModal.classList.remove('active');
        });

        // Close on backdrop click
        promoModal.addEventListener('click', (e) => {
            if (e.target === promoModal) {
                promoModal.classList.remove('active');
            }
        });
    }

});
