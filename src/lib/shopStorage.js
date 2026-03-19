const PRODUCTS = [
  // Wash Products
  {
    id: "foam-shampoo",
    name: "Foam Shampoo",
    category: "Wash Products",
    price: 9.90,
    description: "High-foaming pH-neutral shampoo for safe hand washing.",
    inStock: true,
  },
  {
    id: "pre-wash-spray",
    name: "Pre-Wash Spray",
    category: "Wash Products",
    price: 12.00,
    description: "Loosens dirt and grime before contact wash.",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "wheel-cleaner",
    name: "Wheel Cleaner",
    category: "Wash Products",
    price: 14.50,
    description: "Acid-free formula dissolves brake dust and road grime.",
    inStock: true,
  },
  {
    id: "wash-mitt",
    name: "Microfiber Wash Mitt",
    category: "Wash Products",
    price: 8.00,
    description: "Ultra-soft mitt that won't scratch your paint.",
    inStock: true,
  },
  {
    id: "microfiber-set",
    name: "Microfiber Towel Set (6 pcs)",
    category: "Wash Products",
    price: 18.00,
    description: "Premium 400gsm towels for drying and buffing.",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "snow-foam-lance",
    name: "Snow Foam Lance",
    category: "Wash Products",
    price: 35.00,
    description: "Attaches to any pressure washer for thick foam coverage.",
    badge: "New",
    inStock: true,
  },
  {
    id: "bucket-set",
    name: "Wash Bucket Set",
    category: "Wash Products",
    price: 22.00,
    description: "Two-bucket method set with grit guards included.",
    inStock: true,
  },
  {
    id: "drying-aid",
    name: "Drying Aid Spray",
    category: "Wash Products",
    price: 11.00,
    description: "Speeds up drying and adds slick protection.",
    inStock: true,
  },
  // Car Care
  {
    id: "car-wax",
    name: "Carnauba Wax",
    category: "Car Care",
    price: 24.00,
    description: "Natural carnauba wax for deep shine and 6-week protection.",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "quick-detailer",
    name: "Quick Detailer Spray",
    category: "Car Care",
    price: 15.00,
    description: "Instant gloss boost and dust removal between washes.",
    inStock: true,
  },
  {
    id: "leather-conditioner",
    name: "Leather Conditioner",
    category: "Car Care",
    price: 19.00,
    description: "Nourishes and protects leather seats from cracking.",
    inStock: true,
  },
  {
    id: "interior-dressing",
    name: "Interior Dressing",
    category: "Car Care",
    price: 11.00,
    description: "Matte finish for dashboards, trim and plastics.",
    inStock: true,
  },
  {
    id: "glass-cleaner",
    name: "Glass Cleaner",
    category: "Car Care",
    price: 8.50,
    description: "Streak-free formula for crystal-clear windows.",
    inStock: true,
  },
  {
    id: "paint-sealant",
    name: "Paint Sealant",
    category: "Car Care",
    price: 45.00,
    description: "Synthetic sealant — up to 6 months paint protection.",
    badge: "New",
    inStock: true,
  },
  {
    id: "tire-dressing",
    name: "Tire Dressing Gel",
    category: "Car Care",
    price: 12.00,
    description: "Long-lasting gloss for tyres without sling.",
    inStock: true,
  },
  {
    id: "air-freshener",
    name: "Car Air Freshener",
    category: "Car Care",
    price: 6.00,
    description: "Premium scent diffuser for a clean, fresh cabin.",
    inStock: true,
  },
  {
    id: "clay-bar",
    name: "Clay Bar Kit",
    category: "Car Care",
    price: 28.00,
    description: "Removes bonded contaminants for a smooth-as-glass finish.",
    inStock: true,
  },
];

export function listProducts() {
  return PRODUCTS;
}

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function getProductsByCategory(category) {
  return PRODUCTS.filter((p) => p.category === category);
}

// Cart — localStorage key
const CART_KEY = "sw_cart_v1";

function readRaw() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRaw(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCart() {
  return readRaw();
}

export function addToCart(id) {
  const cart = readRaw();
  const existing = cart.find((x) => x.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  writeRaw(cart);
}

export function removeFromCart(id) {
  writeRaw(readRaw().filter((x) => x.id !== id));
}

export function updateQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  const cart = readRaw();
  const existing = cart.find((x) => x.id === id);
  if (existing) {
    existing.quantity = qty;
    writeRaw(cart);
  }
}

export function clearCart() {
  writeRaw([]);
}

export function getCartCount() {
  return readRaw().reduce((sum, x) => sum + x.quantity, 0);
}
