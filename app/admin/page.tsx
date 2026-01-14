"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { supabase, SUPABASE_CONFIG_OK } from "@/lib/supabaseClient";

type StatusState = "error" | "success" | "info" | "";

type StatusMessage = {
  text: string;
  state: StatusState;
};

type ContentItem = {
  key: string;
  target: string;
  defaultValue: string;
  type: string;
};

type ContentRecord = {
  content_key: string;
  content_value: string;
  content_type: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categories: string[] | null;
  inventory_count: number | null;
  image_url: string | null;
  is_active: boolean;
};

const PAGE_FILES: Record<string, string> = {
  global: "index.html",
  home: "index.html",
  "our-story": "our-story.html",
  booking: "booking.html",
  policies: "policies.html",
  faq: "faq.html",
  stylists: "stylists.html",
  "stylist-profile": "stylist-profile.html",
  "join-our-team": "join-our-team.html",
  contact: "contact.html",
  store: "store.html",
  login: "login.html"
};

const CONTENT_PAGES = [
  { value: "global", label: "Global (Nav + Footer)" },
  { value: "home", label: "Home" },
  { value: "our-story", label: "Our Story" },
  { value: "booking", label: "Booking" },
  { value: "policies", label: "Policies" },
  { value: "faq", label: "FAQ" },
  { value: "stylists", label: "Stylists" },
  { value: "stylist-profile", label: "Stylist Profile" },
  { value: "join-our-team", label: "Join Our Team" },
  { value: "contact", label: "Contact" },
  { value: "store", label: "Store" },
  { value: "login", label: "Store Login" }
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function inferTarget(element: Element | null) {
  if (!element) {
    return "text";
  }
  const tag = element.tagName ? element.tagName.toLowerCase() : "";
  if (tag === "img") {
    return "src";
  }
  if (tag === "meta") {
    return "meta";
  }
  return "text";
}

function normalizeAssetPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("assets/")) {
    return `/${trimmed}`;
  }
  return trimmed;
}

function normalizeHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("assets/")) {
    return `/${trimmed}`;
  }
  if (trimmed.endsWith(".html")) {
    const base = trimmed.replace(/\.html$/, "");
    if (base === "index") {
      return "/";
    }
    return `/${base}`;
  }
  const cleaned = trimmed.startsWith("./") ? trimmed.slice(2) : trimmed;
  return `/${cleaned}`;
}

function normalizeTemplateValue(value: string, target: string) {
  if (!value) {
    return value;
  }
  if (target === "href") {
    return normalizeHref(value);
  }
  if (target === "src" || target === "background" || target === "data") {
    return normalizeAssetPath(value);
  }
  return value;
}

function getDefaultValue(element: Element | null, target: string) {
  if (!element) {
    return "";
  }
  switch (target) {
    case "src":
      return element.getAttribute("src") || "";
    case "background":
      return element.getAttribute("data-content-default") || "";
    case "meta":
      return element.getAttribute("content") || "";
    case "data":
      return element.getAttribute("data") || "";
    default:
      return element.textContent ? element.textContent.trim() : "";
  }
}

function collectContentItems(documentRoot: Document, pageId: string) {
  const isGlobal = pageId === "global";
  const selector = isGlobal
    ? '[data-content-key][data-content-scope="global"]'
    : '[data-content-key]:not([data-content-scope="global"])';
  const items = new Map<string, ContentItem>();

  documentRoot.querySelectorAll(selector).forEach((element) => {
    const key = element.getAttribute("data-content-key");
    if (!key || items.has(key)) {
      return;
    }
    const target = element.getAttribute("data-content-target") || inferTarget(element);
    const rawValue = getDefaultValue(element, target);
    items.set(key, {
      key,
      target,
      type: target,
      defaultValue: normalizeTemplateValue(rawValue, target)
    });
  });

  const hrefSelector = isGlobal
    ? '[data-content-href-key][data-content-scope="global"]'
    : '[data-content-href-key]:not([data-content-scope="global"])';
  documentRoot.querySelectorAll(hrefSelector).forEach((element) => {
    const key = element.getAttribute("data-content-href-key");
    if (!key || items.has(key)) {
      return;
    }
    const rawValue = element.getAttribute("href") || "";
    items.set(key, {
      key,
      target: "href",
      type: "href",
      defaultValue: normalizeTemplateValue(rawValue, "href")
    });
  });

  return Array.from(items.values());
}

async function fetchContentDefaults(pageId: string) {
  const file = PAGE_FILES[pageId];
  if (!file) {
    throw new Error("Unknown page.");
  }

  const response = await fetch(`/templates/${file}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load page template.");
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return collectContentItems(doc, pageId);
}

async function fetchContentRecords(pageId: string) {
  const { data, error } = await supabase
    .from("site_content")
    .select("content_key, content_value, content_type")
    .eq("page", pageId);

  if (error) {
    throw new Error(error.message);
  }

  const map = new Map<string, ContentRecord>();
  (data || []).forEach((record) => {
    if (!record.content_key) {
      return;
    }
    map.set(record.content_key, record as ContentRecord);
  });
  return map;
}

async function saveContentItem(pageId: string, key: string, value: string, type: string) {
  const payload = {
    page: pageId,
    content_key: key,
    content_value: value,
    content_type: type,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("site_content")
    .upsert(payload, { onConflict: "page,content_key" });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Saved." };
}

async function uploadContentImage(file: File, key: string) {
  const extension = file.name.split(".").pop();
  const safeKey = key.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const path = `content/${safeKey}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}

async function uploadProductImage(file: File, name: string) {
  const extension = file.name.split(".").pop();
  const safeName = name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const path = `products/${safeName}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminPage() {
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<StatusMessage>({ text: "", state: "" });
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [contentPage, setContentPage] = useState("global");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [contentStatus, setContentStatus] = useState<StatusMessage>({ text: "", state: "" });
  const [contentItemStatus, setContentItemStatus] = useState<Record<string, StatusMessage>>({});

  const [products, setProducts] = useState<Product[]>([]);
  const [productMessage, setProductMessage] = useState<StatusMessage>({ text: "", state: "" });
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [productInventory, setProductInventory] = useState("");
  const [productActive, setProductActive] = useState(true);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const resetProductForm = useCallback(() => {
    setProductId("");
    setProductName("");
    setProductPrice("");
    setProductDescription("");
    setProductCategories("");
    setProductInventory("");
    setProductActive(true);
    setProductImageUrl("");
    setProductFile(null);
    setProductPreview("");
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setProductMessage({ text: "", state: "" });
  }, []);

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, categories, inventory_count, image_url, is_active")
      .order("created_at", { ascending: true });

    if (error) {
      setProductMessage({ text: error.message, state: "error" });
      return;
    }

    const normalized = (data || []).map((product) => ({
      ...(product as Product),
      price: Number(product.price || 0)
    }));
    setProducts(normalized);
  }, []);

  const loadContentManager = useCallback(async () => {
    setContentStatus({ text: "Loading content...", state: "info" });
    try {
      const defaults = await fetchContentDefaults(contentPage);
      const records = await fetchContentRecords(contentPage);
      const nextValues: Record<string, string> = {};
      const nextItems = defaults.map((item) => {
        const record = records.get(item.key);
        const type = record?.content_type || item.target;
        const value = record?.content_value ?? item.defaultValue;
        nextValues[item.key] = value || "";
        return { ...item, type };
      });
      setContentItems(nextItems);
      setContentValues(nextValues);
      setContentItemStatus({});
      setContentStatus({ text: `Loaded ${nextItems.length} items.`, state: "success" });
    } catch (error) {
      setContentStatus({
        text: error instanceof Error ? error.message : "Unable to load content.",
        state: "error"
      });
    }
  }, [contentPage]);

  const handleSession = useCallback(
    async (session: { user: { id: string; email?: string } } | null) => {
      const user = session ? session.user : null;
      setCurrentUser(user);
      if (!user) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, is_admin")
        .eq("id", user.id)
        .single();

      if (error || !data || !data.is_admin) {
        setAuthStatus({ text: "You do not have admin access.", state: "error" });
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      setAuthStatus({ text: "", state: "" });
      setIsAdmin(true);
      setAuthReady(true);
    },
    []
  );

  useEffect(() => {
    let isActive = true;
    if (!SUPABASE_CONFIG_OK) {
      setAuthStatus({
        text: "Set your Supabase URL and anon key in your environment variables.",
        state: "error"
      });
      setAuthReady(true);
      return () => {
        isActive = false;
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!isActive) {
        return;
      }
      void handleSession(data.session as { user: { id: string; email?: string } } | null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session as { user: { id: string; email?: string } } | null);
    });

    return () => {
      isActive = false;
      authListener?.subscription.unsubscribe();
    };
  }, [handleSession]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    void loadProducts();
  }, [isAdmin, loadProducts]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    void loadContentManager();
  }, [isAdmin, loadContentManager]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!SUPABASE_CONFIG_OK) {
      setAuthStatus({
        text: "Set your Supabase URL and anon key in your environment variables.",
        state: "error"
      });
      return;
    }

    const email = authEmail.trim();
    const password = authPassword.trim();
    if (!email || !password) {
      setAuthStatus({ text: "Enter your email and password.", state: "error" });
      return;
    }

    setAuthStatus({ text: "Signing in...", state: "info" });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthStatus({ text: error.message, state: "error" });
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function handleContentSave(key: string) {
    const item = contentItems.find((entry) => entry.key === key);
    if (!item) {
      return;
    }
    const value = contentValues[key] || "";
    setContentItemStatus((prev) => ({
      ...prev,
      [key]: { text: "Saving...", state: "info" }
    }));
    const result = await saveContentItem(contentPage, key, value, item.type);
    setContentItemStatus((prev) => ({
      ...prev,
      [key]: { text: result.message, state: result.ok ? "success" : "error" }
    }));
  }

  async function handleContentFileUpload(key: string, file: File) {
    const item = contentItems.find((entry) => entry.key === key);
    if (!item) {
      return;
    }

    setContentItemStatus((prev) => ({
      ...prev,
      [key]: { text: "Uploading image...", state: "info" }
    }));

    try {
      const url = await uploadContentImage(file, key);
      setContentValues((prev) => ({ ...prev, [key]: url }));
      const result = await saveContentItem(contentPage, key, url, item.type);
      setContentItemStatus((prev) => ({
        ...prev,
        [key]: { text: result.message, state: result.ok ? "success" : "error" }
      }));
    } catch (error) {
      setContentItemStatus((prev) => ({
        ...prev,
        [key]: {
          text: error instanceof Error ? error.message : "Unable to upload image.",
          state: "error"
        }
      }));
    }
  }

  function handleProductFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setProductFile(file || null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setProductPreview(url);
    } else {
      setProductPreview(productImageUrl);
    }
  }

  function handleEditProduct(product: Product) {
    setProductId(product.id);
    setProductName(product.name || "");
    setProductPrice(String(product.price ?? ""));
    setProductDescription(product.description || "");
    setProductCategories((product.categories || []).join(", "));
    setProductInventory(
      product.inventory_count === null || product.inventory_count === undefined
        ? ""
        : String(product.inventory_count)
    );
    setProductActive(product.is_active !== false);
    setProductImageUrl(product.image_url || "");
    setProductFile(null);
    setProductPreview(product.image_url || "");
    setProductMessage({ text: "Editing product. Update fields and save.", state: "info" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDeleteProduct(productIdValue: string) {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    const { error } = await supabase.from("products").delete().eq("id", productIdValue);
    if (error) {
      setProductMessage({ text: error.message, state: "error" });
      return;
    }
    await loadProducts();
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = productName.trim();
    const price = Number(productPrice);
    const description = productDescription.trim();
    const categories = productCategories
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const inventory =
      productInventory === "" || Number.isNaN(Number(productInventory))
        ? null
        : Number(productInventory);
    const isActive = productActive;

    if (!name || Number.isNaN(price)) {
      setProductMessage({ text: "Enter a product name and price.", state: "error" });
      return;
    }

    setProductMessage({ text: "Saving product...", state: "info" });

    let imageUrl = productImageUrl;
    if (productFile) {
      try {
        imageUrl = await uploadProductImage(productFile, name);
      } catch (error) {
        setProductMessage({
          text: error instanceof Error ? error.message : "Unable to upload product image.",
          state: "error"
        });
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
    if (productId) {
      const response = await supabase.from("products").update(payload).eq("id", productId);
      error = response.error;
    } else {
      const response = await supabase.from("products").insert(payload);
      error = response.error;
    }

    if (error) {
      setProductMessage({ text: error.message, state: "error" });
      return;
    }

    resetProductForm();
    setProductMessage({ text: "Product saved.", state: "success" });
    await loadProducts();
  }

  const authLabel = useMemo(() => {
    if (!authReady) {
      return "Checking session...";
    }
    if (!SUPABASE_CONFIG_OK) {
      return "Supabase configuration missing.";
    }
    return "";
  }, [authReady]);

  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <h1 className="hero-title">Admin Dashboard</h1>
          <p className="hero-subtitle">Manage site content, images, and store products.</p>
        </div>
      </section>

      <section className="section">
        <div className="container admin-shell">
          {!isAdmin && (
            <div className="admin-card">
              <p className="section-kicker">Admin Login</p>
              <h2>Sign in to manage the site</h2>
              <form className="admin-form" onSubmit={handleSignIn}>
                <div className="form-field">
                  <label htmlFor="admin-email">Email</label>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="admin-password">Password</label>
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    minLength={6}
                    required
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                  />
                </div>
                <div className="auth-actions">
                  <button className="btn" type="submit" disabled={!SUPABASE_CONFIG_OK}>
                    Sign In
                  </button>
                </div>
                <p className="status-message" data-state={authStatus.state || undefined}>
                  {authStatus.text || authLabel}
                </p>
              </form>
            </div>
          )}

          {isAdmin && (
            <div className="admin-card">
              <div className="admin-header">
                <div>
                  <p className="section-kicker">Admin Tools</p>
                  <h2>Content + Store Manager</h2>
                  <p className="small-note">Signed in as {currentUser?.email || "admin"}</p>
                </div>
                <button className="btn btn-secondary btn-small" type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>

              <div className="admin-grid">
                <div className="admin-section">
                  <h3>Site Content</h3>
                  <div className="admin-content-controls">
                    <label htmlFor="content-page">Page</label>
                    <select
                      id="content-page"
                      value={contentPage}
                      onChange={(event) => setContentPage(event.target.value)}
                    >
                      {CONTENT_PAGES.map((page) => (
                        <option key={page.value} value={page.value}>
                          {page.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-secondary btn-small"
                      type="button"
                      onClick={loadContentManager}
                    >
                      Load Content
                    </button>
                  </div>
                  <p className="small-note" data-state={contentStatus.state || undefined}>
                    {contentStatus.text}
                  </p>
                  <div className="admin-content-list">
                    {contentItems.length === 0 && (
                      <p className="small-note">No editable content found for this page.</p>
                    )}
                    {contentItems.map((item) => {
                      const value = contentValues[item.key] ?? "";
                      const status = contentItemStatus[item.key] || { text: "", state: "" };
                      const type = item.type;
                      return (
                        <div className="admin-item" key={item.key}>
                          <div className="admin-item-header">
                            <span className="admin-item-key">{item.key}</span>
                            <span className="admin-item-type">{type}</span>
                          </div>
                          <div className="admin-item-body">
                            {(type === "text" || type === "meta") && (
                              <textarea
                                rows={3}
                                value={value}
                                onChange={(event) =>
                                  setContentValues((prev) => ({
                                    ...prev,
                                    [item.key]: event.target.value
                                  }))
                                }
                              />
                            )}
                            {type === "href" && (
                              <input
                                type="url"
                                value={value}
                                onChange={(event) =>
                                  setContentValues((prev) => ({
                                    ...prev,
                                    [item.key]: event.target.value
                                  }))
                                }
                              />
                            )}
                            {(type === "src" || type === "background") && (
                              <>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(event) =>
                                    setContentValues((prev) => ({
                                      ...prev,
                                      [item.key]: event.target.value
                                    }))
                                  }
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.target.files && event.target.files[0];
                                    if (file) {
                                      void handleContentFileUpload(item.key, file);
                                    }
                                  }}
                                />
                                {value && (
                                  <img className="admin-preview" src={value} alt={`${item.key} preview`} />
                                )}
                              </>
                            )}
                            {type !== "text" &&
                              type !== "meta" &&
                              type !== "href" &&
                              type !== "src" &&
                              type !== "background" && (
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(event) =>
                                    setContentValues((prev) => ({
                                      ...prev,
                                      [item.key]: event.target.value
                                    }))
                                  }
                                />
                              )}
                            <button
                              className="btn btn-secondary btn-small"
                              type="button"
                              onClick={() => handleContentSave(item.key)}
                            >
                              Save
                            </button>
                            <p className="status-message" data-state={status.state || undefined}>
                              {status.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="admin-section">
                  <h3>Store Products</h3>
                  <form className="admin-form" onSubmit={handleProductSubmit}>
                    <div className="form-field">
                      <label htmlFor="product-name">Product name</label>
                      <input
                        id="product-name"
                        type="text"
                        required
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="product-price">Price (USD)</label>
                      <input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={productPrice}
                        onChange={(event) => setProductPrice(event.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="product-description">Description</label>
                      <textarea
                        id="product-description"
                        rows={3}
                        value={productDescription}
                        onChange={(event) => setProductDescription(event.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-field">
                      <label htmlFor="product-categories">Categories (comma separated)</label>
                      <input
                        id="product-categories"
                        type="text"
                        value={productCategories}
                        onChange={(event) => setProductCategories(event.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="product-inventory">Inventory count</label>
                      <input
                        id="product-inventory"
                        type="number"
                        min="0"
                        step="1"
                        value={productInventory}
                        onChange={(event) => setProductInventory(event.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="product-image">Product image</label>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleProductFileChange}
                      />
                      {(productPreview || productImageUrl) && (
                        <img
                          className="admin-preview"
                          src={productPreview || productImageUrl}
                          alt="Product preview"
                        />
                      )}
                    </div>
                    <div className="form-field">
                      <label>
                        <input
                          type="checkbox"
                          checked={productActive}
                          onChange={(event) => setProductActive(event.target.checked)}
                        />{" "}
                        Active in store
                      </label>
                    </div>
                    <div className="auth-actions">
                      <button className="btn" type="submit">
                        Save product
                      </button>
                      <button className="btn btn-secondary" type="button" onClick={resetProductForm}>
                        Clear
                      </button>
                    </div>
                    <p className="status-message" data-state={productMessage.state || undefined}>
                      {productMessage.text}
                    </p>
                  </form>

                  <div className="admin-products">
                    {products.length === 0 && (
                      <p className="small-note">No products yet. Add your first item above.</p>
                    )}
                    {products.length > 0 && (
                      <table className="admin-table">
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
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>
                                {product.image_url ? (
                                  <img className="admin-preview" src={product.image_url} alt={product.name} />
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{product.name}</td>
                              <td>{formatter.format(Number(product.price || 0))}</td>
                              <td>{product.inventory_count ?? 0}</td>
                              <td>{product.is_active ? "Yes" : "No"}</td>
                              <td>
                                <button
                                  className="btn btn-secondary btn-small"
                                  type="button"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-secondary btn-small"
                                  type="button"
                                  onClick={() => void handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
