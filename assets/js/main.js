function setupNav() {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!button || !nav) {
    return;
  }

  button.addEventListener('click', () => {
    const isOpen = nav.dataset.open === 'true';
    nav.dataset.open = isOpen ? 'false' : 'true';
    button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.dataset.open = 'false';
      button.setAttribute('aria-expanded', 'false');
    });
  });
}

function highlightActiveNav() {
  const current = document.body.dataset.page;
  if (!current) {
    return;
  }

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    if (link.getAttribute('data-page-link') === current) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function setupConfirmationForms() {
  const defaultConfirmation = 'Thanks for reaching out. We will be in touch soon.';

  document.querySelectorAll('form[data-confirmation]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const message = form.querySelector('.form-message');
      const confirmation = form.dataset.confirmation || defaultConfirmation;

      if (message) {
        message.textContent = confirmation;
      }

      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  highlightActiveNav();
  setupConfirmationForms();
});
