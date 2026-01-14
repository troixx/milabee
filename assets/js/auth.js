import { supabase, SUPABASE_CONFIG_OK } from './supabase-client.js';

window.__authReady = true;

const form = document.querySelector('[data-auth-form]');
const message = document.querySelector('[data-auth-message]');

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

function getMode() {
  if (!form) {
    return 'sign-in';
  }
  return form.dataset.authMode === 'sign-up' ? 'sign-up' : 'sign-in';
}

async function redirectIfLoggedIn() {
  if (!SUPABASE_CONFIG_OK) {
    setMessage('Set your Supabase URL and anon key in assets/js/supabase-config.js.', 'error');
    return;
  }
  const { data } = await supabase.auth.getUser();
  if (data && data.user) {
    window.location.href = 'store.html';
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!SUPABASE_CONFIG_OK) {
    setMessage('Set your Supabase URL and anon key in assets/js/supabase-config.js.', 'error');
    return;
  }

  const email = form.querySelector('#email').value.trim();
  const password = form.querySelector('#password').value.trim();
  if (!email || !password) {
    setMessage('Enter your email and password.', 'error');
    return;
  }

  setMessage('Working...', 'info');
  const mode = getMode();
  if (mode === 'sign-in') {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message, 'error');
      return;
    }
    window.location.href = 'store.html';
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setMessage(error.message, 'error');
    return;
  }

  if (data && data.session) {
    window.location.href = 'store.html';
    return;
  }

  setMessage('Check your email to confirm your account, then sign in.', 'info');
}

if (form) {
  form.addEventListener('submit', handleSubmit);
}

redirectIfLoggedIn();
