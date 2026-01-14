"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase, SUPABASE_CONFIG_OK } from "@/lib/supabaseClient";
import { ContentText } from "@/components/content";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  inventory_count: number | null;
  image_url: string | null;
  is_active: boolean;
};

type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function StoreSection() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [storeMessage, setStoreMessage] = useState<{ text: string; state: string }>({
    text: "",
    state: ""
  });
  const [cartMessage, setCartMessage] = useState<{ text: string; state: string }>({
    text: "",
    state: ""
  });

  const productIndex = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  useEffect(() => {
    if (!SUPABASE_CONFIG_OK) {
      setStoreMessage({
        text: "Set your Supabase URL and anon key in your environment variables.",
        state: "error"
      });
      return;
    }

    supabase
      .from("products")
      .select("id, name, description, price, inventory_count, image_url, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setStoreMessage({ text: error.message, state: "error" });
          return;
        }
        const normalized = (data || []).map((product) => ({
          ...product,
          price: Number(product.price)
        })) as Product[];
        setProducts(normalized);
      });

    supabase.auth.getSession().then(({ data }) => {
      setCurrentUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadCart(data.session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setCartItems([]);
      if (user) {
        loadCart(user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function loadCart(userId: string) {
    setCartMessage({ text: "Loading cart...", state: "info" });
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      setCartMessage({ text: error.message, state: "error" });
      return;
    }

    setCartItems((data as CartItem[]) || []);
    setCartMessage({ text: "", state: "" });
  }

  async function addToCart(productId: string) {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const product = productIndex.get(productId);
    if (!product) {
      setStoreMessage({ text: "Unable to add this item right now.", state: "error" });
      return;
    }

    if (product.inventory_count !== null && product.inventory_count !== undefined && product.inventory_count <= 0) {
      setStoreMessage({ text: "This item is currently out of stock.", state: "error" });
      return;
    }

    const existing = cartItems.find((item) => item.product_id === productId);
    const nextQuantity = existing ? existing.quantity + 1 : 1;

    const { error } = await supabase
      .from("cart_items")
      .upsert(
        {
          user_id: currentUser.id,
          product_id: productId,
          quantity: nextQuantity
        },
        { onConflict: "user_id,product_id" }
      );

    if (error) {
      setStoreMessage({ text: error.message, state: "error" });
      return;
    }

    setStoreMessage({ text: "Added to cart.", state: "success" });
    await loadCart(currentUser.id);
  }

  async function updateCartItem(id: string, quantity: number) {
    if (!currentUser) {
      return;
    }
    if (quantity <= 0) {
      await removeCartItem(id);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .eq("user_id", currentUser.id);

    if (error) {
      setCartMessage({ text: error.message, state: "error" });
      return;
    }

    await loadCart(currentUser.id);
  }

  async function removeCartItem(id: string) {
    if (!currentUser) {
      return;
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", currentUser.id);
    if (error) {
      setCartMessage({ text: error.message, state: "error" });
      return;
    }

    await loadCart(currentUser.id);
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

    const { error } = await supabase.from("orders").insert({
      user_id: currentUser.id,
      items: orderItems,
      total
    });

    if (error) {
      setCartMessage({ text: error.message, state: "error" });
      return;
    }

    await supabase.from("cart_items").delete().eq("user_id", currentUser.id);
    setCartMessage({
      text: "Order saved. The studio will follow up for payment and pickup.",
      state: "success"
    });
    await loadCart(currentUser.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const signedIn = Boolean(currentUser);
  const cartTotal = cartItems.reduce((sum, item) => {
    const product = productIndex.get(item.product_id);
    const price = product ? product.price : 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="section">
      <div className="container store-layout">
        <div>
          <ContentText
            as="p"
            className="section-kicker"
            contentKey="store.section.kicker"
            defaultValue="Retail Favorites"
          />
          <ContentText
            as="h2"
            contentKey="store.section.title"
            defaultValue="Shop the collection"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="store.section.lead"
            defaultValue="Curated products used by Mila Bee Studios professionals."
          />
          <div className="store-status status-message" data-state={signedIn ? "success" : undefined}>
            {signedIn
              ? `Signed in as ${currentUser?.email || "guest"}.`
              : "Sign in to add items to your cart."}{" "}
            {!signedIn && (
              <a href="/login" className="btn btn-secondary btn-small">
                Store Login
              </a>
            )}
          </div>
          <p className="status-message" data-state={storeMessage.state || undefined}>
            {storeMessage.text}
          </p>
          <div className="store-grid">
            {products.length === 0 ? (
              <p className="small-note">No products are available right now.</p>
            ) : (
              products.map((product) => {
                const inStock =
                  product.inventory_count === null ||
                  product.inventory_count === undefined ||
                  product.inventory_count > 0;
                return (
                  <article className="product-card" key={product.id}>
                    {product.image_url ? (
                      <div className="product-media">
                        <img src={product.image_url} alt={product.name} loading="lazy" />
                      </div>
                    ) : (
                      <div className="product-art product-art--placeholder"></div>
                    )}
                    <div className="product-body">
                      <h3>{product.name}</h3>
                      <p className="product-price">{formatter.format(product.price || 0)}</p>
                      <p className="product-desc">{product.description || ""}</p>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => addToCart(product.id)}
                        disabled={!signedIn || !inStock}
                      >
                        {inStock ? "Add to Cart" : "Out of stock"}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
        <aside className="cart-panel">
          <div className="cart-header">
            <div>
              <ContentText
                as="p"
                className="section-kicker"
                contentKey="store.cart.kicker"
                defaultValue="Your Cart"
              />
              <ContentText
                as="h2"
                contentKey="store.cart.title"
                defaultValue="Cart"
              />
              <p className="small-note">
                <ContentText
                  as="span"
                  contentKey="store.cart.signedin"
                  defaultValue="Signed in as"
                />{" "}
                <span>{signedIn ? currentUser?.email || "guest" : "guest"}</span>
              </p>
            </div>
            <button
              className="btn btn-secondary btn-small"
              type="button"
              onClick={signOut}
              hidden={!signedIn}
            >
              Sign out
            </button>
          </div>
          <ContentText
            as="p"
            className="small-note"
            contentKey="store.cart.empty"
            defaultValue="Your cart is empty."
            style={{ display: cartItems.length > 0 ? "none" : "block" }}
          />
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = productIndex.get(item.product_id);
              const price = product ? product.price : 0;
              return (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h4>{product ? product.name : item.product_id}</h4>
                    <p className="small-note">{formatter.format(price)} each</p>
                  </div>
                  <div className="cart-controls">
                    <label className="sr-only" htmlFor={`qty-${item.id}`}>
                      Quantity
                    </label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateCartItem(item.id, Number(event.target.value))}
                    />
                    <button
                      className="btn btn-secondary btn-small"
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-total-row">
            <ContentText as="span" contentKey="store.cart.total" defaultValue="Total" />
            <strong>{formatter.format(cartTotal)}</strong>
          </div>
          <p className="status-message" data-state={cartMessage.state || undefined}>
            {cartMessage.text}
          </p>
          <button
            className="btn"
            type="button"
            disabled={!signedIn || cartItems.length === 0}
            onClick={placeOrder}
          >
            <ContentText as="span" contentKey="store.cart.checkout" defaultValue="Place Order" />
          </button>
          <ContentText
            as="p"
            className="small-note"
            contentKey="store.cart.note"
            defaultValue="Orders are saved to your account. Payment and pickup are coordinated by the studio."
          />
        </aside>
      </div>
    </section>
  );
}
