import { supabase, SUPABASE_CONFIG_OK } from './supabase-client.js';

const PAGE_FILES = {
  global: 'index.html',
  home: 'index.html',
  'our-story': 'our-story.html',
  booking: 'booking.html',
  policies: 'policies.html',
  faq: 'faq.html',
  stylists: 'stylists.html',
  'stylist-profile': 'stylist-profile.html',
  'join-our-team': 'join-our-team.html',
  contact: 'contact.html',
  store: 'store.html',
  login: 'login.html'
};

const authCard = document.querySelector('[data-admin-auth]');
const authForm = document.querySelector('[data-admin-form]');
const authMessage = document.querySelector('[data-admin-message]');
const adminPanel = document.querySelector('[data-admin-panel]');
const adminEmail = document.querySelector('[data-admin-email]');
const signOutButton = document.querySelector('[data-admin-signout]');

const contentPageSelect = document.querySelector('[data-content-page]');
const contentLoadButton = document.querySelector('[data-content-load]');
const contentStatus = document.querySelector('[data-content-status]');
const contentList = document.querySelector('[data-content-list]');

const productForm = document.querySelector('[data-product-form]');
const productMessage = document.querySelector('[data-product-message]');
const productList = document.querySelector('[data-product-list]');
const productIdInput = document.querySelector('[data-product-id]');
const productNameInput = document.querySelector('[data-product-name]');
const productPriceInput = document.querySelector('[data-product-price]');
const productDescriptionInput = document.querySelector('[data-product-description]');
const productCategoriesInput = document.querySelector('[data-product-categories]');
const productInventoryInput = document.querySelector('[data-product-inventory]');
const productImageInput = document.querySelector('[data-product-image]');
const productPreview = document.querySelector('[data-product-preview]');
const productActiveInput = document.querySelector('[data-product-active]');
const productResetButton = document.querySelector('[data-product-reset]');

let currentUser = null;

function setMessage(element, text, state) {
  if (!element) {
    return;
  }
  element.textContent = text || '';
  if (state) {
    element.dataset.state = state;
  } else {
    delete element.dataset.state;
  }
}

function showAuthPanel() {
  if (authCard) {
    authCard.hidden = false;
  }
  if (adminPanel) {
    adminPanel.hidden = true;
  }
}

function showAdminPanel() {
  if (authCard) {
    authCard.hidden = true;
  }
  if (adminPanel) {
    adminPanel.hidden = false;
  }
}

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, is_admin')
    .eq('id', userId)
    .single();

  if (error) {
    return { error };
  }

  return { profile: data };
}

async function handleSession(session) {
  currentUser = session ? session.user : null;

  if (!currentUser) {
    showAuthPanel();
    return;
  }

  const { profile, error } = await fetchProfile(currentUser.id);
  if (error || !profile || !profile.is_admin) {
    setMessage(authMessage, 'You do not have admin access.', 'error');
    showAuthPanel();
    return;
  }

  if (adminEmail) {
    adminEmail.textContent = currentUser.email || 'admin';
  }

  showAdminPanel();
  await loadProducts();
  if (contentPageSelect) {
    await loadContentManager();
  }
}

async function handleSignIn(event) {
  event.preventDefault();
  if (!SUPABASE_CONFIG_OK) {
    setMessage(authMessage, 'Set your Supabase URL and anon key in assets/js/supabase-config.js.', 'error');
    return;
  }

  const email = authForm.querySelector('#admin-email').value.trim();
  const password = authForm.querySelector('#admin-password').value.trim();
  if (!email || !password) {
    setMessage(authMessage, 'Enter your email and password.', 'error');
    return;
  }

  setMessage(authMessage, 'Signing in...', 'info');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setMessage(authMessage, error.message, 'error');
    return;
  }
}

async function handleSignOut() {
  await supabase.auth.signOut();
  showAuthPanel();
}

function inferTarget(element) {
  if (!element) {
    return 'text';
  }
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  if (tag === 'img') {
    return 'src';
  }
  if (tag === 'meta') {
    return 'meta';
  }
  return 'text';
}

function getDefaultValue(element, target) {
  if (!element) {
    return '';
  }
  switch (target) {
    case 'src':
      return element.getAttribute('src') || '';
    case 'background':
      return element.getAttribute('data-content-default') || '';
    case 'meta':
      return element.getAttribute('content') || '';
    case 'data':
      return element.getAttribute('data') || '';
    default:
      return element.textContent ? element.textContent.trim() : '';
  }
}

function collectContentItems(documentRoot, pageId) {
  const isGlobal = pageId === 'global';
  const selector = isGlobal
    ? '[data-content-key][data-content-scope="global"]'
    : '[data-content-key]:not([data-content-scope="global"])';
  const items = new Map();

  documentRoot.querySelectorAll(selector).forEach((element) => {
    const key = element.dataset.contentKey;
    if (!key || items.has(key)) {
      return;
    }
    const target = element.dataset.contentTarget || inferTarget(element);
    items.set(key, {
      key,
      target,
      defaultValue: getDefaultValue(element, target)
    });
  });

  const hrefSelector = isGlobal
    ? '[data-content-href-key][data-content-scope="global"]'
    : '[data-content-href-key]:not([data-content-scope="global"])';
  documentRoot.querySelectorAll(hrefSelector).forEach((element) => {
    const key = element.dataset.contentHrefKey;
    if (!key || items.has(key)) {
      return;
    }
    items.set(key, {
      key,
      target: 'href',
      defaultValue: element.getAttribute('href') || ''
    });
  });

  return Array.from(items.values());
}

async function fetchContentDefaults(pageId) {
  const file = PAGE_FILES[pageId];
  if (!file) {
    throw new Error('Unknown page.');
  }

  const response = await fetch(file, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to load page template.');
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return collectContentItems(doc, pageId);
}

async function fetchContentRecords(pageId) {
  const { data, error } = await supabase
    .from('site_content')
    .select('content_key, content_value, content_type')
    .eq('page', pageId);

  if (error) {
    throw new Error(error.message);
  }

  const map = new Map();
  (data || []).forEach((record) => {
    map.set(record.content_key, record);
  });
  return map;
}

async function saveContentItem(pageId, key, value, type, statusElement) {
  const payload = {
    page: pageId,
    content_key: key,
    content_value: value,
    content_type: type,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('site_content')
    .upsert(payload, { onConflict: 'page,content_key' });

  if (error) {
    setMessage(statusElement, error.message, 'error');
    return false;
  }

  setMessage(statusElement, 'Saved.', 'success');
  return true;
}

async function uploadContentImage(file, key) {
  const extension = file.name.split('.').pop();
  const safeKey = key.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const path = `content/${safeKey}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from('site-images').upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return data.publicUrl;
}

function renderContentItems(pageId, items, existingMap) {
  if (!contentList) {
    return;
  }

  contentList.innerHTML = '';

  if (!items.length) {
    const note = document.createElement('p');
    note.className = 'small-note';
    note.textContent = 'No editable content found for this page.';
    contentList.appendChild(note);
    return;
  }

  items.forEach((item) => {
    const record = existingMap.get(item.key);
    const value = record ? record.content_value : item.defaultValue;
    const type = record && record.content_type ? record.content_type : item.target;

    const card = document.createElement('div');
    card.className = 'admin-item';

    const header = document.createElement('div');
    header.className = 'admin-item-header';

    const keyLabel = document.createElement('span');
    keyLabel.className = 'admin-item-key';
    keyLabel.textContent = item.key;

    const typeLabel = document.createElement('span');
    typeLabel.className = 'admin-item-type';
    typeLabel.textContent = type;

    header.appendChild(keyLabel);
    header.appendChild(typeLabel);

    const body = document.createElement('div');
    body.className = 'admin-item-body';

    const status = document.createElement('p');
    status.className = 'status-message';

    let input = null;
    let fileInput = null;
    let preview = null;

    if (type === 'text' || type === 'meta') {
      input = document.createElement('textarea');
      input.rows = 3;
      input.value = value || '';
    } else if (type === 'href') {
      input = document.createElement('input');
      input.type = 'url';
      input.value = value || '';
    } else if (type === 'src' || type === 'background') {
      input = document.createElement('input');
      input.type = 'text';
      input.value = value || '';

      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      preview = document.createElement('img');
      preview.className = 'admin-preview';
      if (value) {
        preview.src = value;
      } else {
        preview.hidden = true;
      }
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.value = value || '';
    }

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-secondary btn-small';
    saveButton.textContent = 'Save';

    saveButton.addEventListener('click', async () => {
      const nextValue = input ? input.value.trim() : '';
      await saveContentItem(pageId, item.key, nextValue, type, status);
    });

    body.appendChild(input);
    if (fileInput) {
      body.appendChild(fileInput);
    }
    if (preview) {
      body.appendChild(preview);
    }
    body.appendChild(saveButton);
    body.appendChild(status);

    if (fileInput) {
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
          return;
        }
        setMessage(status, 'Uploading image...', 'info');
        try {
          const url = await uploadContentImage(file, item.key);
          input.value = url;
          preview.src = url;
          preview.hidden = false;
          await saveContentItem(pageId, item.key, url, type, status);
        } catch (error) {
          setMessage(status, error.message, 'error');
        }
      });
    }

    card.appendChild(header);
    card.appendChild(body);
    contentList.appendChild(card);
  });
}

async function loadContentManager() {
  if (!contentPageSelect) {
    return;
  }

  const pageId = contentPageSelect.value;
  setMessage(contentStatus, 'Loading content...', 'info');

  try {
    const defaults = await fetchContentDefaults(pageId);
    const records = await fetchContentRecords(pageId);
    renderContentItems(pageId, defaults, records);
    setMessage(contentStatus, `Loaded ${defaults.length} items.`, 'success');
  } catch (error) {
    setMessage(contentStatus, error.message, 'error');
  }
}

function resetProductForm() {
  if (!productForm) {
    return;
  }
  productForm.reset();
  if (productIdInput) {
    productIdInput.value = '';
  }
  productForm.dataset.imageUrl = '';
  if (productPreview) {
    productPreview.hidden = true;
    productPreview.removeAttribute('src');
  }
  setMessage(productMessage, '');
}

async function uploadProductImage(file, name) {
  const extension = file.name.split('.').pop();
  const safeName = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const path = `products/${safeName}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

async function loadProducts() {
  if (!productList) {
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, categories, inventory_count, image_url, is_active')
    .order('created_at', { ascending: true });

  if (error) {
    setMessage(productMessage, error.message, 'error');
    return;
  }

  renderProductList(data || []);
}

function renderProductList(products) {
  if (!productList) {
    return;
  }
  productList.innerHTML = '';

  if (!products.length) {
    const note = document.createElement('p');
    note.className = 'small-note';
    note.textContent = 'No products yet. Add your first item above.';
    productList.appendChild(note);
    return;
  }

  const table = document.createElement('table');
  table.className = 'admin-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Inventory</th>
        <th>Active</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  products.forEach((product) => {
    const row = document.createElement('tr');

    const imageCell = document.createElement('td');
    if (product.image_url) {
      const image = document.createElement('img');
      image.src = product.image_url;
      image.alt = product.name;
      image.className = 'admin-preview';
      imageCell.appendChild(image);
    } else {
      imageCell.textContent = '—';
    }

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name;

    const priceCell = document.createElement('td');
    priceCell.textContent = Number(product.price || 0).toFixed(2);

    const inventoryCell = document.createElement('td');
    inventoryCell.textContent = product.inventory_count ?? 0;

    const activeCell = document.createElement('td');
    activeCell.textContent = product.is_active ? 'Yes' : 'No';

    const actionsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-secondary btn-small';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      populateProductForm(product);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-secondary btn-small';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
      if (!window.confirm('Delete this product?')) {
        return;
      }
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) {
        setMessage(productMessage, error.message, 'error');
        return;
      }
      await loadProducts();
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(inventoryCell);
    row.appendChild(activeCell);
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });

  productList.appendChild(table);
}

function populateProductForm(product) {
  if (!productForm) {
    return;
  }
  productIdInput.value = product.id;
  productNameInput.value = product.name || '';
  productPriceInput.value = product.price || '';
  productDescriptionInput.value = product.description || '';
  productCategoriesInput.value = (product.categories || []).join(', ');
  productInventoryInput.value = product.inventory_count ?? 0;
  productActiveInput.checked = product.is_active !== false;
  productForm.dataset.imageUrl = product.image_url || '';

  if (productPreview) {
    if (product.image_url) {
      productPreview.src = product.image_url;
      productPreview.hidden = false;
    } else {
      productPreview.hidden = true;
    }
  }
  setMessage(productMessage, 'Editing product. Update fields and save.', 'info');
}

async function handleProductSubmit(event) {
  event.preventDefault();
  if (!productForm) {
    return;
  }

  const name = productNameInput.value.trim();
  const price = Number(productPriceInput.value);
  const description = productDescriptionInput.value.trim();
  const categories = productCategoriesInput.value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const inventory = productInventoryInput.value === '' ? null : Number(productInventoryInput.value);
  const isActive = productActiveInput.checked;

  if (!name || Number.isNaN(price)) {
    setMessage(productMessage, 'Enter a product name and price.', 'error');
    return;
  }

  setMessage(productMessage, 'Saving product...', 'info');

  let imageUrl = productForm.dataset.imageUrl || '';
  const file = productImageInput.files && productImageInput.files[0];
  if (file) {
    try {
      imageUrl = await uploadProductImage(file, name);
    } catch (error) {
      setMessage(productMessage, error.message, 'error');
      return;
    }
  }

  const payload = {
    name,
    price,
    description,
    categories,
    inventory_count: inventory ?? 0,
    image_url: imageUrl || null,
    is_active: isActive
  };

  let error = null;
  if (productIdInput.value) {
    const response = await supabase
      .from('products')
      .update(payload)
      .eq('id', productIdInput.value);
    error = response.error;
  } else {
    const response = await supabase.from('products').insert(payload);
    error = response.error;
  }

  if (error) {
    setMessage(productMessage, error.message, 'error');
    return;
  }

  resetProductForm();
  setMessage(productMessage, 'Product saved.', 'success');
  await loadProducts();
}

async function init() {
  if (!SUPABASE_CONFIG_OK) {
    setMessage(authMessage, 'Set your Supabase URL and anon key in assets/js/supabase-config.js.', 'error');
    showAuthPanel();
    return;
  }

  const { data } = await supabase.auth.getSession();
  await handleSession(data.session);

  supabase.auth.onAuthStateChange((_event, session) => {
    handleSession(session);
  });
}

if (authForm) {
  authForm.addEventListener('submit', handleSignIn);
}

if (signOutButton) {
  signOutButton.addEventListener('click', handleSignOut);
}

if (contentLoadButton) {
  contentLoadButton.addEventListener('click', loadContentManager);
}

if (productForm) {
  productForm.addEventListener('submit', handleProductSubmit);
}

if (productResetButton) {
  productResetButton.addEventListener('click', resetProductForm);
}

init();
