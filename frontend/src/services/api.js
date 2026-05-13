const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@nandani.local";
const TOKEN_KEY = "nandani_admin_token";

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function monthYear(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function normalizeSocial(social = {}) {
  return {
    instagram: social.instagram || "",
  };
}

function resolveAssetUrl(value = "") {
  if (!value) return "";
  if (value.startsWith("/uploads/")) {
    return `${API_ORIGIN}${value}`;
  }
  return value;
}

function buildHeaders(extra = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const auth = token ? { Authorization: `Bearer ${token}` } : {};
  return { "Content-Type": "application/json", ...auth, ...extra };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
    }
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}

function mapCategory(doc) {
  return {
    id: doc._id || doc.id,
    name: doc.name,
    category: doc.category,
    desc: doc.desc || "",
    img: resolveAssetUrl(doc.img),
    emoji: doc.emoji || "*",
    displayOrder: doc.displayOrder ?? 0,
  };
}

function mapInstagramPost(doc) {
  const postedDate = doc.postedDate
    ? new Date(doc.postedDate).toISOString().slice(0, 10)
    : "";
  const title = doc.title || doc.name || "";
  const imageUrl = resolveAssetUrl(doc.imageUrl || doc.img || "");
  const instagramUrl = doc.instagramUrl || doc.url || "";

  return {
    id: doc._id || doc.id,
    title,
    name: title,
    caption: doc.caption || "",
    date: doc.postedDate ? monthYear(doc.postedDate) : doc.date || "Recent",
    postedDate,
    img: imageUrl,
    imageUrl,
    url: instagramUrl,
    instagramUrl,
    type: doc.type || "image",
    isFeatured: Boolean(doc.isFeatured),
    containsPerson: Boolean(doc.containsPerson),
  };
}

function mapReview(doc) {
  return {
    id: doc._id || doc.id,
    name: doc.name,
    location: doc.location || "India",
    rating: doc.rating,
    text: doc.text,
    avatar: doc.avatar || "NA",
    date: monthYear(doc.createdAt),
    isApproved: Boolean(doc.isApproved),
    createdAt: doc.createdAt || null,
  };
}

function mapBusinessInfo(doc) {
  return {
    line1: doc.line1 || "",
    line2: doc.line2 || "",
    phone: doc.phone || "",
    email: doc.email || "",
    hours: doc.hours || "",
    social: normalizeSocial(doc.social),
  };
}

export const authApi = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  clearToken() {
    clearStoredToken();
  },
  async login(password) {
    const payload = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    });
    localStorage.setItem(TOKEN_KEY, payload.token);
    return payload;
  },
  async verify() {
    return request("/auth/verify");
  },
  async logout() {
    try {
      return await request("/auth/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }
  },
};

export const categoriesApi = {
  async list() {
    const payload = await request("/categories");
    return payload.data.map(mapCategory);
  },
  async create(item) {
    const payload = await request("/categories", {
      method: "POST",
      body: JSON.stringify(item),
    });
    return mapCategory(payload.data);
  },
  async update(id, item) {
    const payload = await request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
    return mapCategory(payload.data);
  },
  async remove(id) {
    return request(`/categories/${id}`, { method: "DELETE" });
  },
};

export const businessInfoApi = {
  async get() {
    const payload = await request("/business-info");
    return mapBusinessInfo(payload.data);
  },
  async update(data) {
    const payload = await request("/business-info", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mapBusinessInfo(payload.data);
  },
};

export const instagramApi = {
  async list(limit) {
    const query =
      typeof limit === "number" ? `?limit=${encodeURIComponent(limit)}` : "";
    const payload = await request(`/instagram-posts${query}`);
    return payload.data.map(mapInstagramPost);
  },
  async create(post) {
    const payload = await request("/instagram-posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
    return mapInstagramPost(payload.data);
  },
  async update(id, post) {
    const payload = await request(`/instagram-posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    });
    return mapInstagramPost(payload.data);
  },
  async remove(id) {
    return request(`/instagram-posts/${id}`, { method: "DELETE" });
  },
};

export const reviewsApi = {
  async list() {
    const payload = await request("/reviews");
    return payload.data.map(mapReview);
  },
  async listAdmin() {
    const payload = await request("/reviews/admin");
    return payload.data.map(mapReview);
  },
  async updateStatus(id, isApproved) {
    const payload = await request(`/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
    return mapReview(payload.data);
  },
  async remove(id) {
    return request(`/reviews/${id}`, { method: "DELETE" });
  },
  async create(review) {
    const payload = await request("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    });
    return mapReview(payload.data);
  },
};

export const uploadsApi = {
  async uploadImage({ dataUrl, fileName, folder }) {
    const payload = await request("/uploads/image", {
      method: "POST",
      body: JSON.stringify({ dataUrl, fileName, folder }),
    });
    return payload.data;
  },
};
