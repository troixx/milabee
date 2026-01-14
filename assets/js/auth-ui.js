(() => {
  const form = document.querySelector('[data-auth-form]');
  if (!form) {
    return;
  }

  const title = document.querySelector('[data-auth-title]');
  const subtitle = document.querySelector('[data-auth-subtitle]');
  const submit = document.querySelector('[data-auth-submit]');
  const toggle = document.querySelector('[data-auth-toggle]');
  const message = document.querySelector('[data-auth-message]');
  const copyContainer = document.querySelector('[data-auth-copy]');
  const passwordInput = form.querySelector('#password');

  function getCopy(key, fallback) {
    if (!copyContainer) {
      return fallback;
    }
    const element = copyContainer.querySelector(`[data-auth-copy-key="${key}"]`);
    if (!element) {
      return fallback;
    }
    const text = element.textContent ? element.textContent.trim() : '';
    return text || fallback;
  }

  function setMessage(text, state) {
    if (!message) {
      return;
    }
    message.textContent = text || '';
    if (state) {
      message.dataset.state = state;
    } else {
      delete message.dataset.state;
    }
  }

  function setMode(nextMode) {
    const mode = nextMode === 'sign-up' ? 'sign-up' : 'sign-in';
    form.dataset.authMode = mode;
    const isSignIn = mode === 'sign-in';

    if (title) {
      title.textContent = isSignIn
        ? getCopy('title-signin', 'Sign in to the store')
        : getCopy('title-signup', 'Create your store account');
    }
    if (subtitle) {
      subtitle.textContent = isSignIn
        ? getCopy('subtitle-signin', 'Access your saved cart and order history.')
        : getCopy('subtitle-signup', 'Create an account to save your cart and orders.');
    }
    if (submit) {
      submit.textContent = isSignIn
        ? getCopy('submit-signin', 'Sign In')
        : getCopy('submit-signup', 'Create Account');
    }
    if (toggle) {
      toggle.textContent = isSignIn
        ? getCopy('toggle-signup', 'Need an account? Create one')
        : getCopy('toggle-signin', 'Already have an account? Sign in');
    }
    if (passwordInput) {
      passwordInput.autocomplete = isSignIn ? 'current-password' : 'new-password';
    }
    setMessage('');
  }

  function toggleMode(event) {
    if (event) {
      event.preventDefault();
    }
    const current = form.dataset.authMode === 'sign-up' ? 'sign-up' : 'sign-in';
    setMode(current === 'sign-in' ? 'sign-up' : 'sign-in');
  }

  form.addEventListener('submit', (event) => {
    if (window.__authReady) {
      return;
    }
    event.preventDefault();
    const isFile = window.location.protocol === 'file:';
    const hint = isFile
      ? 'Open this page from a local server (example: http://localhost:8000/login.html).'
      : 'Check your console for blocked scripts or network errors.';
    setMessage(`Auth script did not load. ${hint}`, 'error');
  });

  if (toggle) {
    toggle.addEventListener('click', toggleMode);
  }

  setMode(form.dataset.authMode || 'sign-in');

  document.addEventListener('content:loaded', () => {
    setMode(form.dataset.authMode || 'sign-in');
  });
})();
