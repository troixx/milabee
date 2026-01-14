import { supabase, SUPABASE_CONFIG_OK } from './supabase-client.js';

let products = [];
let productIndex = new Map();
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const productList = document.querySelector('[data-product-list]');
const storeStatus = document.querySelector('[data-store-status]');
const storeMessage = document.querySelector('[data-store-message]');
const cartItemsElement = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartMessage = document.querySelector('[data-cart-message]');
const checkoutButton = document.querySelector('[data-checkout]');
const signOutButton = document.querySelector('[data-signout]');
const userEmail = document.querySelector('[data-user-email]');

let currentUser = null;
let cartItems = [];

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

function clearProducts() {
  if (!productList) {
    return;
  }
  productList.innerHTML = '';
}

function renderProducts() {
  if (!productList) {
    return;
  }

  clearProducts();

  if (!products.length) {
    const note = document.createElement('p');
    note.className = 'small-note';
    note.textContent = 'No products are available right now.';
    productList.appendChild(note);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const media = document.createElement('div');
    if (product.image_url) {
      media.className = 'product-media';
      const image = document.createElement('img');
      image.src = product.image_url;
      image.alt = product.name;
      image.loading = 'lazy';
      media.appendChild(image);
    } else {
      media.className = 'product-art product-art--placeholder';
    }

    const body = document.createElement('div');
    body.className = 'product-body';

    const name = document.createElement('h3');
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'product-price';
    price.textContent = formatter.format(product.price || 0);

    const description = document.createElement('p');
    description.className = 'product-desc';
    description.textContent = product.description || '';

    const button = document.createElement('button');
    button.className = 'btn btn-secondary';
    button.type = 'button';
    button.dataset.addToCart = product.id;

    const inStock = product.inventory_count === null || product.inventory_count === undefined
      ? true
      : product.inventory_count > 0;
    button.dataset.instock = inStock ? 'true' : 'false';
    button.textContent = inStock ? 'Add to Cart' : 'Out of stock';
    button.disabled = !inStock;

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(description);
    body.appendChild(button);

    card.appendChild(media);
    card.appendChild(body);
    productList.appendChild(card);
  });

  productList.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-add-to-cart');
      addToCart(productId);
    });
  });
}

function toggleShopActions(enabled) {
  if (!productList) {
    return;
  }
  productList.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    const inStock = button.dataset.instock !== 'false';
    button.disabled = !enabled || !inStock;
  });
}

async function updateSession(session) {
  currentUser = session ? session.user : null;
  const signedIn = Boolean(currentUser);

  if (userEmail) {
    userEmail.textContent = signedIn ? currentUser.email : 'guest';
  }

  if (storeStatus) {
    if (signedIn) {
      storeStatus.textContent = `Signed in as ${currentUser.email}.`;
    } else {
      storeStatus.innerHTML = 'Sign in to add items to your cart. <a href="login.html">Store Login</a>.';
    }
  }

  if (signOutButton) {
    signOutButton.hidden = !signedIn;
  }

  toggleShopActions(signedIn);
  cartItems = [];
  renderCart();

  if (signedIn) {
    await loadCart();
  }
}

async function loadProducts() {
  if (!SUPABASE_CONFIG_OK) {
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, inventory_count, image_url, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    setMessage(storeMessage, error.message, 'error');
    return;
  }

  products = (data || []).map((product) => ({
    ...product,
    price: Number(product.price)
  }));
  productIndex = new Map(products.map((product) => [product.id, product]));
  renderProducts();
  toggleShopActions(Boolean(currentUser));
}

async function loadCart() {
  if (!currentUser) {
    return;
  }

  setMessage(cartMessage, 'Loading cart...', 'info');
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, created_at')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: true });

  if (error) {
    setMessage(cartMessage, error.message, 'error');
    return;
  }

  cartItems = data || [];
  setMessage(cartMessage, '');
  renderCart();
}

async function addToCart(productId) {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const product = productIndex.get(productId);
  if (!product) {
    setMessage(storeMessage, 'Unable to add this item right now.', 'error');
    return;
  }

  if (product.inventory_count !== null && product.inventory_count !== undefined && product.inventory_count <= 0) {
    setMessage(storeMessage, 'This item is currently out of stock.', 'error');
    return;
  }

  const existing = cartItems.find((item) => item.product_id === productId);
  const nextQuantity = existing ? existing.quantity + 1 : 1;

  const { error } = await supabase
    .from('cart_items')
    .upsert(
      {
        user_id: currentUser.id,
        product_id: productId,
        quantity: nextQuantity
      },
      { onConflict: 'user_id,product_id' }
    );

  if (error) {
    setMessage(storeMessage, error.message, 'error');
    return;
  }

  setMessage(storeMessage, 'Added to cart.', 'success');
  await loadCart();
}

async function updateCartItem(id, quantity) {
  if (!currentUser) {
    return;
  }
  if (quantity <= 0) {
    await removeCartItem(id);
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .eq('user_id', currentUser.id);

  if (error) {
    setMessage(cartMessage, error.message, 'error');
    return;
  }

  await loadCart();
}

async function removeCartItem(id) {
  if (!currentUser) {
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
    .eq('user_id', currentUser.id);

  if (error) {
    setMessage(cartMessage, error.message, 'error');
    return;
  }

  await loadCart();
}

function renderCart() {
  if (!cartItemsElement) {
    return;
  }

  cartItemsElement.innerHTML = '';
  const hasItems = cartItems.length > 0;
  if (cartEmpty) {
    cartEmpty.hidden = hasItems;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const product = productIndex.get(item.product_id);
    const price = product ? product.price : 0;
    total += price * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    const info = document.createElement('div');
    const title = document.createElement('h4');
    title.textContent = product ? product.name : item.product_id;
    const priceNote = document.createElement('p');
    priceNote.className = 'small-note';
    priceNote.textContent = `${formatter.format(price)} each`;
    info.appendChild(title);
    info.appendChild(priceNote);

    const controls = document.createElement('div');
    controls.className = 'cart-controls';

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.setAttribute('for', `qty-${item.id}`);
    label.textContent = 'Quantity';

    const input = document.createElement('input');
    input.id = `qty-${item.id}`;
    input.type = 'number';
    input.min = '1';
    input.value = item.quantity;
    input.dataset.qty = item.id;

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-secondary btn-small';
    removeButton.type = 'button';
    removeButton.dataset.remove = item.id;
    removeButton.textContent = 'Remove';

    controls.appendChild(label);
    controls.appendChild(input);
    controls.appendChild(removeButton);

    row.appendChild(info);
    row.appendChild(controls);
    cartItemsElement.appendChild(row);
  });

  if (cartTotal) {
    cartTotal.textContent = formatter.format(total);
  }

  if (checkoutButton) {
    checkoutButton.disabled = !currentUser || !hasItems;
  }

  cartItemsElement.querySelectorAll('[data-qty]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.getAttribute('data-qty');
      const value = Number(input.value);
      updateCartItem(id, value);
    });
  });

  cartItemsElement.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-remove');
      removeCartItem(id);
    });
  });
}

async function placeOrder() {
  if (!currentUser || cartItems.length === 0) {
    return;
  }

  const orderItems = cartItems.map((item) => {
    const product = productIndex.get(item.product_id);
    return {
      product_id: item.product_id,
      name: product ? product.name : item.product_id,
      price: product ? product.price : 0,
      quantity: item.quantity
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { error } = await supabase.from('orders').insert({
    user_id: currentUser.id,
    items: orderItems,
    total
  });

  if (error) {
    setMessage(cartMessage, error.message, 'error');
    return;
  }

  await supabase.from('cart_items').delete().eq('user_id', currentUser.id);
  setMessage(cartMessage, 'Order saved. The studio will follow up for payment and pickup.', 'success');
  await loadCart();
}

async function signOut() {
  await supabase.auth.signOut();
}

async function init() {
  if (!SUPABASE_CONFIG_OK) {
    setMessage(storeMessage, 'Set your Supabase URL and anon key in assets/js/supabase-config.js.', 'error');
    toggleShopActions(false);
    return;
  }

  await loadProducts();

  const { data } = await supabase.auth.getSession();
  await updateSession(data.session);

  supabase.auth.onAuthStateChange((_event, session) => {
    updateSession(session);
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', placeOrder);
  }

  if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
  }
}

init();
