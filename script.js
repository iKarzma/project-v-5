// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled', 'shadow-sm');
    } else {
      navbar.classList.remove('navbar-scrolled', 'shadow-sm');
    }
  });

  // Smooth scroll for anchor links
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

  // Carousel auto-play configuration
  const carousel = document.querySelector('#carouselExampleCaptions');
  if (carousel) {
    const carouselInstance = new bootstrap.Carousel(carousel, {
      interval: 3000, // Change slides every 3 seconds
      wrap: true
    });

    // Pause carousel on hover
    carousel.addEventListener('mouseenter', () => {
      carouselInstance.pause();
    });

    carousel.addEventListener('mouseleave', () => {
      carouselInstance.cycle();
    });
  }

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .solution-card');
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight;

      if (elementPosition < screenPosition) {
        element.classList.add('animate');
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);

  // Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Dynamic year in footer
  const yearElement = document.querySelector('.footer-bottom p');
  if (yearElement) {
    yearElement.innerHTML = yearElement.innerHTML.replace('2024', new Date().getFullYear());
  }

  // Back to top button
  const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    });

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  createBackToTopButton();

  // Add loading state to buttons
  const actionButtons = document.querySelectorAll('.btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (!this.classList.contains('btn-link')) {
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 1000);
      }
    });
  });

  // Handle dropdown hover on desktop
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    if (window.innerWidth > 992) { // Only on desktop
      dropdown.addEventListener('mouseenter', function () {
        this.querySelector('.dropdown-menu').classList.add('show');
      });

      dropdown.addEventListener('mouseleave', function () {
        this.querySelector('.dropdown-menu').classList.remove('show');
      });
    }
  });

  // Ensure dropdowns work properly on mobile
  const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
  dropdownToggle.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 992) { // Only on mobile
        e.preventDefault();
        e.stopPropagation();
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle('show');
      }
    });
  });

  // Handle mobile navbar toggler
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarToggler) {
    navbarToggler.addEventListener('click', function () {
      navbarCollapse.classList.toggle('show');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
      navbarCollapse.classList.remove('show');
    }
  });

  // Handle dropdown in mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth < 992) { // Mobile only
        e.preventDefault();
        e.stopPropagation();

        // Close other open dropdowns
        dropdownToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.nextElementSibling.classList.remove('show');
          }
        });

        // Toggle current dropdown
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle('show');
      }
    });
  });
});