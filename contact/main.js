document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const buttonText = submitButton.querySelector('.button-text');
  const spinner = submitButton.querySelector('.spinner-border');

  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
          e.stopPropagation();
          contactForm.classList.add('was-validated');
          return;
      }

      // Show loading state
      buttonText.textContent = 'Sending...';
      spinner.classList.remove('d-none');
      submitButton.disabled = true;

      // Collect form data
      const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
      };

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
          // Success simulation
          showAlert('Message sent successfully!', 'success');
          contactForm.reset();
          contactForm.classList.remove('was-validated');

          // Reset button state
          buttonText.textContent = 'Send Message';
          spinner.classList.add('d-none');
          submitButton.disabled = false;
      }, 2000);
  });

  // Alert function
  function showAlert(message, type) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
      alertDiv.role = 'alert';
      alertDiv.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      contactForm.parentElement.insertBefore(alertDiv, contactForm);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
          alertDiv.remove();
      }, 5000);
  }
});