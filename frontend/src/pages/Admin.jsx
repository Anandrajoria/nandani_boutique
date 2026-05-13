import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewport } from "../hooks";
import {
  authApi,
  businessInfoApi,
  categoriesApi,
  instagramApi,
  reviewsApi,
  uploadsApi,
} from "../services/api";
import { compressImageFile } from "../utils/imageUpload";

const CATEGORY_OPTIONS = ["Lehenga", "Kurti", "Blouse", "Western Wear"];
const INSTAGRAM_TYPE_OPTIONS = ["image", "video", "carousel"];
const EMPTY_SOCIAL = { instagram: "" };

const EMPTY_ITEM_FORM = {
  id: null,
  name: "",
  desc: "",
  img: "",
  category: "Lehenga",
};

const EMPTY_INSTAGRAM_FORM = {
  id: null,
  title: "",
  caption: "",
  imageUrl: "",
  instagramUrl: "",
  postedDate: "",
  type: "image",
  isFeatured: false,
  containsPerson: true,
};

function normalizeAddressForm(address = {}) {
  return {
    line1: address.line1 || "",
    line2: address.line2 || "",
    phone: address.phone || "",
    email: address.email || "",
    hours: address.hours || "",
    social: {
      ...EMPTY_SOCIAL,
      ...(address.social || {}),
    },
  };
}

function sortInstagramPosts(posts = []) {
  return [...posts].sort((a, b) => {
    const left = new Date(b.postedDate || 0).getTime();
    const right = new Date(a.postedDate || 0).getTime();
    return left - right;
  });
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  rows = 4,
}) {
  const sharedStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    borderRadius: 4,
    fontSize: 14,
    color: "var(--text-primary)",
    fontFamily: "Jost, sans-serif",
    outline: "none",
    transition: "border-color 0.25s, background 0.4s, color 0.4s",
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 7,
        }}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          style={{ ...sharedStyle, resize: "vertical" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={sharedStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
        />
      )}
    </div>
  );
}

function ToggleField({ label, checked, onChange, helper }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        border: "1px solid var(--input-border)",
        borderRadius: 4,
        background: "var(--input-bg)",
        cursor: "pointer",
        marginBottom: 14,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 16,
          height: 16,
          marginTop: 2,
          accentColor: "var(--gold)",
          flexShrink: 0,
        }}
      />
      <div>
        <p
          style={{
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--text-primary)",
            marginBottom: helper ? 4 : 0,
          }}
        >
          {label}
        </p>
        {helper && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {helper}
          </p>
        )}
      </div>
    </label>
  );
}

function UploadField({
  label,
  helper,
  uploading,
  onFileSelect,
  accept = "image/*",
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 7,
        }}
      >
        {label}
      </p>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          padding: "12px 14px",
          border: "1px solid var(--input-border)",
          borderRadius: 4,
          background: "var(--input-bg)",
          cursor: uploading ? "wait" : "pointer",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {uploading ? "Uploading image..." : helper}
        </span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--gold)",
            whiteSpace: "nowrap",
          }}
        >
          {uploading ? "Please wait" : "Choose image"}
        </span>
        <input
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={async (event) => {
            const [file] = event.target.files || [];
            event.target.value = "";
            if (file) {
              await onFileSelect(file);
            }
          }}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}

function LoginScreen({ onAuth }) {
  const { isMobile } = useViewport();
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    setLoading(true);
    try {
      await authApi.login(pass);
      onAuth(true);
    } catch (error) {
      const message =
        error?.message === "Failed to fetch"
          ? "Backend server is not running. Start the backend on port 3000 and try again."
          : error?.message || "Login failed. Please try again.";
      setError(message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        transition: "background 0.4s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: "var(--bg-surface)",
          padding: isMobile ? "36px 20px" : "52px 48px",
          borderRadius: 4,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
          width: 360,
          maxWidth: "100%",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 30,
              fontWeight: 400,
              marginBottom: 6,
              color: "var(--text-primary)",
            }}
          >
            Admin Login
          </p>
          <p style={{ fontSize: 11, letterSpacing: 2.5, color: "var(--gold)" }}>
            NANDANI BOUTIQUE
          </p>
        </div>

        <input
          type="password"
          placeholder="Enter password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--input-border)",
            borderRadius: 4,
            fontSize: 14,
            marginBottom: 14,
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            fontFamily: "Jost, sans-serif",
            outline: "none",
            transition: "background 0.4s, border-color 0.4s, color 0.4s",
          }}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 12,
                color: "#c62828",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={attempt}
          disabled={loading}
          style={{
            width: "100%",
            padding: 13,
            background: "var(--text-primary)",
            color: "var(--text-invert)",
            border: "none",
            borderRadius: 28,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.3s, color 0.3s",
            opacity: loading ? 0.8 : 1,
          }}
          onMouseEnter={(e) => (e.target.style.background = "var(--gold)")}
          onMouseLeave={(e) =>
            (e.target.style.background = "var(--text-primary)")
          }
        >
          {loading ? "Checking..." : "Enter"}
        </button>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Use your backend admin password
        </p>
      </motion.div>
    </div>
  );
}

export default function Admin({
  categories,
  setCategories,
  address,
  setAddress,
  instagramPosts,
  setInstagramPosts,
}) {
  const { isMobile } = useViewport();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("items");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [uploading, setUploading] = useState({
    collection: false,
    instagram: false,
  });
  const [reviewFilter, setReviewFilter] = useState("pending");
  const [flash, setFlash] = useState({ message: "", tone: "success" });
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [instagramForm, setInstagramForm] = useState(EMPTY_INSTAGRAM_FORM);
  const [addrForm, setAddrForm] = useState(normalizeAddressForm(address));

  useEffect(() => {
    setAddrForm(normalizeAddressForm(address));
  }, [address]);

  useEffect(() => {
    let mounted = true;

    async function verifyToken() {
      if (!authApi.getToken()) return;
      try {
        await authApi.verify();
        if (mounted) setAuthed(true);
      } catch {
        authApi.clearToken();
      }
    }

    verifyToken();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!authed) return undefined;

    let mounted = true;

    async function loadFeedback() {
      setReviewsLoading(true);
      try {
        const data = await reviewsApi.listAdmin();
        if (mounted) setReviews(data);
      } catch (error) {
        if (mounted) showFlash(`Feedback load failed: ${error.message}`, "error");
      } finally {
        if (mounted) setReviewsLoading(false);
      }
    }

    async function loadInstagramPosts() {
      setInstagramLoading(true);
      try {
        const data = await instagramApi.list();
        if (mounted) setInstagramPosts(sortInstagramPosts(data));
      } catch (error) {
        if (mounted) showFlash(`Instagram load failed: ${error.message}`, "error");
      } finally {
        if (mounted) setInstagramLoading(false);
      }
    }

    loadFeedback();
    loadInstagramPosts();

    return () => {
      mounted = false;
    };
  }, [authed, setInstagramPosts]);

  const showFlash = (message, tone = "success") => {
    setFlash({ message, tone });
    setTimeout(() => setFlash({ message: "", tone: "success" }), 2800);
  };

  const resetItemForm = () => setItemForm(EMPTY_ITEM_FORM);
  const resetInstagramForm = () => setInstagramForm(EMPTY_INSTAGRAM_FORM);

  const handleImageUpload = async ({
    file,
    folder,
    uploadKey,
    onComplete,
    maxSide,
  }) => {
    setUploading((current) => ({ ...current, [uploadKey]: true }));

    try {
      const { dataUrl, fileName } = await compressImageFile(file, {
        maxSide,
        quality: 0.92,
      });
      const uploaded = await uploadsApi.uploadImage({
        dataUrl,
        fileName,
        folder,
      });
      onComplete(uploaded.url);
      showFlash("Image uploaded successfully.");
    } catch (error) {
      showFlash(error.message, "error");
    } finally {
      setUploading((current) => ({ ...current, [uploadKey]: false }));
    }
  };

  const handleSaveItem = async () => {
    if (!itemForm.name.trim() || !itemForm.img.trim()) {
      showFlash("Name and image are required.", "error");
      return;
    }

    const payload = {
      name: itemForm.name.trim(),
      desc: itemForm.desc.trim(),
      img: itemForm.img.trim(),
      category: itemForm.category,
      emoji: "*",
    };

    try {
      if (itemForm.id) {
        const updated = await categoriesApi.update(itemForm.id, payload);
        setCategories((current) =>
          current.map((item) => (item.id === itemForm.id ? updated : item)),
        );
        showFlash("Collection item updated.");
      } else {
        const created = await categoriesApi.create(payload);
        setCategories((current) => [created, ...current]);
        showFlash("Collection item added.");
      }
      resetItemForm();
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleSaveInstagram = async () => {
    if (
      !instagramForm.title.trim() ||
      !instagramForm.imageUrl.trim() ||
      !instagramForm.instagramUrl.trim() ||
      !instagramForm.postedDate
    ) {
      showFlash(
        "Title, image, Instagram URL, and posted date are required.",
        "error",
      );
      return;
    }

    const payload = {
      title: instagramForm.title.trim(),
      caption: instagramForm.caption.trim(),
      imageUrl: instagramForm.imageUrl.trim(),
      instagramUrl: instagramForm.instagramUrl.trim(),
      postedDate: instagramForm.postedDate,
      type: instagramForm.type,
      isFeatured: Boolean(instagramForm.isFeatured),
      containsPerson: Boolean(instagramForm.containsPerson),
    };

    try {
      if (instagramForm.id) {
        const updated = await instagramApi.update(instagramForm.id, payload);
        setInstagramPosts((current) =>
          sortInstagramPosts(
            current.map((post) =>
              post.id === instagramForm.id ? updated : post,
            ),
          ),
        );
        showFlash("Instagram post updated.");
      } else {
        const created = await instagramApi.create(payload);
        setInstagramPosts((current) =>
          sortInstagramPosts([created, ...current]),
        );
        showFlash("Instagram post added.");
      }
      resetInstagramForm();
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleSaveAddress = async () => {
    const payload = {
      line1: addrForm.line1.trim(),
      line2: addrForm.line2.trim(),
      phone: addrForm.phone.trim(),
      email: addrForm.email.trim(),
      hours: addrForm.hours.trim(),
      social: {
        instagram: addrForm.social.instagram.trim(),
      },
    };

    try {
      const updated = await businessInfoApi.update(payload);
      setAddress(updated);
      showFlash("Contact information saved.");
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this collection item?")) return;

    try {
      await categoriesApi.remove(id);
      setCategories((current) => current.filter((item) => item.id !== id));
      showFlash("Collection item deleted.");
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleDeleteInstagram = async (id) => {
    if (!window.confirm("Delete this Instagram post?")) return;

    try {
      await instagramApi.remove(id);
      setInstagramPosts((current) => current.filter((post) => post.id !== id));
      showFlash("Instagram post deleted.");
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await reviewsApi.remove(id);
      setReviews((current) => current.filter((review) => review.id !== id));
      showFlash("Feedback deleted.");
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleReviewStatus = async (id, isApproved) => {
    try {
      const updated = await reviewsApi.updateStatus(id, isApproved);
      setReviews((current) =>
        current.map((review) => (review.id === id ? updated : review)),
      );
      showFlash(
        isApproved
          ? "Review approved and published."
          : "Review moved back to pending.",
      );
    } catch (error) {
      showFlash(error.message, "error");
    }
  };

  const handleEditItem = (item) => {
    setItemForm({
      id: item.id,
      name: item.name,
      desc: item.desc || "",
      img: item.img || "",
      category: item.category,
    });
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleEditInstagram = (post) => {
    setInstagramForm({
      id: post.id,
      title: post.title || post.name || "",
      caption: post.caption || "",
      imageUrl: post.imageUrl || post.img || "",
      instagramUrl: post.instagramUrl || post.url || "",
      postedDate: post.postedDate || "",
      type: post.type || "image",
      isFeatured: Boolean(post.isFeatured),
      containsPerson: Boolean(post.containsPerson),
    });
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  if (!authed) return <LoginScreen onAuth={setAuthed} />;

  const panelStyle = {
    background: "var(--bg-surface)",
    padding: isMobile ? 18 : 32,
    borderRadius: 4,
    border: "1px solid var(--border)",
    transition: "background 0.4s, border-color 0.4s",
  };

  const orderedInstagramPosts = sortInstagramPosts(instagramPosts);
  const pendingReviews = reviews.filter((review) => !review.isApproved);
  const approvedReviews = reviews.filter((review) => review.isApproved);
  const visibleReviews =
    reviewFilter === "approved" ? approvedReviews : pendingReviews;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        paddingTop: isMobile ? 64 : 70,
        transition: "background 0.4s",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "48px 5vw" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 32 : 40,
                fontWeight: 400,
                color: "var(--text-primary)",
              }}
            >
              Admin Panel
            </h1>
            <p
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: "var(--gold)",
                marginTop: 4,
              }}
            >
              Manage Your Boutique
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                if (authApi.getToken()) {
                  await authApi.logout();
                }
              } catch {
                authApi.clearToken();
              }
              setAuthed(false);
            }}
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              border: "1px solid var(--border)",
              padding: "8px 20px",
              borderRadius: 20,
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--gold)";
              e.target.style.color = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            Logout
          </button>
        </div>

        <AnimatePresence>
          {flash.message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                background:
                  flash.tone === "error"
                    ? "rgba(229,115,115,0.12)"
                    : "rgba(76,175,80,0.12)",
                border:
                  flash.tone === "error"
                    ? "1px solid #e57373"
                    : "1px solid #66bb6a",
                color: flash.tone === "error" ? "#e57373" : "#66bb6a",
                padding: "12px 20px",
                borderRadius: 4,
                marginBottom: 28,
                fontSize: 14,
              }}
            >
              {flash.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            borderBottom: "1px solid var(--border)",
            marginBottom: 36,
            display: "flex",
            overflowX: "auto",
          }}
        >
          {[
            { key: "items", label: "Collections" },
            { key: "instagram", label: "Instagram" },
            { key: "feedback", label: "Feedback" },
            { key: "address", label: "Address & Contact" },
          ].map((section) => (
            <button
              key={section.key}
              onClick={() => setTab(section.key)}
              style={{
                padding: isMobile ? "12px 16px" : "12px 28px",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                background: "none",
                border: "none",
                borderBottom:
                  tab === section.key
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                color:
                  tab === section.key ? "var(--gold)" : "var(--text-secondary)",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {tab === "items" && (
          <div>
            <div style={{ ...panelStyle, marginBottom: 36 }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: 24,
                }}
              >
                {itemForm.id ? "Edit Item" : "Add New Item"}
              </p>
              <Field
                label="Item Name"
                value={itemForm.name}
                onChange={(value) =>
                  setItemForm((current) => ({ ...current, name: value }))
                }
              />
              <Field
                label="Description"
                value={itemForm.desc}
                onChange={(value) =>
                  setItemForm((current) => ({ ...current, desc: value }))
                }
                type="textarea"
              />
              <Field
                label="Image URL or Public Asset Path"
                value={itemForm.img}
                onChange={(value) =>
                  setItemForm((current) => ({ ...current, img: value }))
                }
                placeholder="https://... or /media/collections/..."
              />
              <UploadField
                label="Upload Collection Image"
                helper="Images are compressed before upload to keep the site fast without softening the look."
                uploading={uploading.collection}
                onFileSelect={(file) =>
                  handleImageUpload({
                    file,
                    folder: "collections",
                    uploadKey: "collection",
                    maxSide: 1800,
                    onComplete: (url) =>
                      setItemForm((current) => ({ ...current, img: url })),
                  })
                }
              />

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginBottom: 7,
                  }}
                >
                  Category
                </label>
                <select
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm((current) => ({
                      ...current,
                      category: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid var(--input-border)",
                    borderRadius: 4,
                    fontSize: 14,
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    fontFamily: "Jost, sans-serif",
                    transition: "background 0.4s, color 0.4s",
                  }}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {itemForm.img && (
                <div style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: 2,
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Preview
                  </p>
                  <img
                    src={itemForm.img}
                    alt="preview"
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleSaveItem}
                  disabled={uploading.collection}
                  style={{
                    padding: "11px 32px",
                    background: "var(--text-primary)",
                    color: "var(--text-invert)",
                    border: "none",
                    borderRadius: 24,
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    opacity: uploading.collection ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "var(--text-primary)")
                  }
                >
                  {itemForm.id ? "Update Item" : "Add Item"}
                </button>
                {itemForm.id && (
                  <button
                    onClick={resetItemForm}
                    style={{
                      padding: "11px 24px",
                      border: "1px solid var(--border)",
                      borderRadius: 24,
                      fontSize: 11,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "var(--gold)";
                      e.target.style.color = "var(--gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.color = "var(--text-secondary)";
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <p
              style={{
                fontSize: 10,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: 16,
              }}
            >
              {categories.length} items in collection
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-surface)",
                    padding: 20,
                    borderRadius: 4,
                    border:
                      itemForm.id === item.id
                        ? "1px solid var(--gold)"
                        : "1px solid var(--border)",
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    flexWrap: "wrap",
                    transition: "all 0.3s",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p
                      style={{
                        fontWeight: 500,
                        marginBottom: 3,
                        fontSize: 15,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {item.category}
                      {item.desc ? ` · ${item.desc.slice(0, 72)}...` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleEditItem(item)}
                      style={{
                        padding: "7px 18px",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "var(--gold)";
                        e.target.style.color = "var(--gold)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.color = "var(--text-secondary)";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        padding: "7px 18px",
                        border: "1px solid rgba(194,50,50,0.35)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "#e57373",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(194,50,50,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "instagram" && (
          <div>
            <div style={{ ...panelStyle, marginBottom: 36 }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: 24,
                }}
              >
                {instagramForm.id ? "Edit Post" : "Add Instagram Post"}
              </p>
              <Field
                label="Title"
                value={instagramForm.title}
                onChange={(value) =>
                  setInstagramForm((current) => ({ ...current, title: value }))
                }
              />
              <Field
                label="Caption"
                value={instagramForm.caption}
                onChange={(value) =>
                  setInstagramForm((current) => ({
                    ...current,
                    caption: value,
                  }))
                }
                type="textarea"
                rows={5}
              />
              <Field
                label="Image URL or Public Asset Path"
                value={instagramForm.imageUrl}
                onChange={(value) =>
                  setInstagramForm((current) => ({
                    ...current,
                    imageUrl: value,
                  }))
                }
                placeholder="https://... or /media/posts/..."
              />
              <UploadField
                label="Upload Instagram Image"
                helper="Portrait and square posts are converted to a high-quality web format before they are stored."
                uploading={uploading.instagram}
                onFileSelect={(file) =>
                  handleImageUpload({
                    file,
                    folder: "instagram",
                    uploadKey: "instagram",
                    maxSide: 1600,
                    onComplete: (url) =>
                      setInstagramForm((current) => ({
                        ...current,
                        imageUrl: url,
                      })),
                  })
                }
              />
              <Field
                label="Instagram Post URL"
                value={instagramForm.instagramUrl}
                onChange={(value) =>
                  setInstagramForm((current) => ({
                    ...current,
                    instagramUrl: value,
                  }))
                }
                placeholder="https://www.instagram.com/p/..."
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                <Field
                  label="Posted Date"
                  value={instagramForm.postedDate}
                  onChange={(value) =>
                    setInstagramForm((current) => ({
                      ...current,
                      postedDate: value,
                    }))
                  }
                  type="date"
                />
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: 7,
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={instagramForm.type}
                    onChange={(e) =>
                      setInstagramForm((current) => ({
                        ...current,
                        type: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      border: "1px solid var(--input-border)",
                      borderRadius: 4,
                      fontSize: 14,
                      background: "var(--input-bg)",
                      color: "var(--text-primary)",
                      fontFamily: "Jost, sans-serif",
                    }}
                  >
                    {INSTAGRAM_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ToggleField
                label="Featured post"
                checked={instagramForm.isFeatured}
                onChange={(value) =>
                  setInstagramForm((current) => ({
                    ...current,
                    isFeatured: value,
                  }))
                }
                helper="Featured posts can be highlighted more prominently in the feed."
              />
              <ToggleField
                label="Contains a person"
                checked={instagramForm.containsPerson}
                onChange={(value) =>
                  setInstagramForm((current) => ({
                    ...current,
                    containsPerson: value,
                  }))
                }
                helper="This keeps the card framing and modal crop aligned for portrait-style content."
              />

              {instagramForm.imageUrl && (
                <div style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: 2,
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Preview
                  </p>
                  <img
                    src={instagramForm.imageUrl}
                    alt="Instagram preview"
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: 160,
                      aspectRatio: instagramForm.containsPerson ? "4 / 5" : "1 / 1",
                      objectFit: instagramForm.containsPerson ? "contain" : "cover",
                      background: "rgba(0,0,0,0.03)",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleSaveInstagram}
                  disabled={uploading.instagram}
                  style={{
                    padding: "11px 32px",
                    background: "var(--text-primary)",
                    color: "var(--text-invert)",
                    border: "none",
                    borderRadius: 24,
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    opacity: uploading.instagram ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "var(--text-primary)")
                  }
                >
                  {instagramForm.id ? "Update Post" : "Add Post"}
                </button>
                {instagramForm.id && (
                  <button
                    onClick={resetInstagramForm}
                    style={{
                      padding: "11px 24px",
                      border: "1px solid var(--border)",
                      borderRadius: 24,
                      fontSize: 11,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "var(--gold)";
                      e.target.style.color = "var(--gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.color = "var(--text-secondary)";
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <p
              style={{
                fontSize: 10,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: 16,
              }}
            >
              {instagramLoading
                ? "Loading Instagram posts..."
                : `${orderedInstagramPosts.length} post${orderedInstagramPosts.length === 1 ? "" : "s"} in feed`}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!instagramLoading && orderedInstagramPosts.length === 0 && (
                <div style={panelStyle}>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    No Instagram posts found.
                  </p>
                </div>
              )}

              {orderedInstagramPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-surface)",
                    padding: 20,
                    borderRadius: 4,
                    border:
                      instagramForm.id === post.id
                        ? "1px solid var(--gold)"
                        : "1px solid var(--border)",
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    flexWrap: "wrap",
                    transition: "all 0.3s",
                  }}
                >
                  <img
                    src={post.imageUrl || post.img}
                    alt={post.title || post.name}
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: 76,
                      aspectRatio: post.containsPerson ? "4 / 5" : "1 / 1",
                      objectFit: post.containsPerson ? "contain" : "cover",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.03)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 6,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: 15,
                          color: "var(--text-primary)",
                        }}
                      >
                        {post.title || post.name}
                      </p>
                      {post.isFeatured && (
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            color: "var(--gold)",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        marginBottom: 4,
                      }}
                    >
                      {post.caption ? `${post.caption.slice(0, 88)}...` : "No caption"}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {post.date || "Recent"} · {post.type}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleEditInstagram(post)}
                      style={{
                        padding: "7px 18px",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "var(--gold)";
                        e.target.style.color = "var(--gold)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.color = "var(--text-secondary)";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInstagram(post.id)}
                      style={{
                        padding: "7px 18px",
                        border: "1px solid rgba(194,50,50,0.35)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "#e57373",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(194,50,50,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "feedback" && (
          <div>
            <div style={{ ...panelStyle, marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: 8,
                }}
              >
                Customer Feedback
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Approve new reviews before they appear on the website, move live
                reviews back to pending, or delete anything you do not want to keep.
              </p>
            </div>

            <p
              style={{
                fontSize: 10,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: 16,
              }}
            >
              {reviewsLoading
                ? "Loading feedback..."
                : `${pendingReviews.length} pending · ${approvedReviews.length} published`}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {[
                { key: "pending", label: `Pending (${pendingReviews.length})` },
                { key: "approved", label: `Published (${approvedReviews.length})` },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setReviewFilter(option.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border:
                      reviewFilter === option.key
                        ? "1px solid var(--gold)"
                        : "1px solid var(--border)",
                    color:
                      reviewFilter === option.key
                        ? "var(--gold)"
                        : "var(--text-secondary)",
                    background: "transparent",
                    fontSize: 11,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!reviewsLoading && visibleReviews.length === 0 && (
                <div style={panelStyle}>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    {reviewFilter === "approved"
                      ? "No published reviews found."
                      : "No pending reviews found."}
                  </p>
                </div>
              )}

              {visibleReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-surface)",
                    padding: 20,
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                    display: "flex",
                    gap: 18,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "var(--gold-dim)",
                      border: "1px solid var(--gold)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold)",
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {review.avatar}
                  </div>

                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 6,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: 15,
                          color: "var(--text-primary)",
                        }}
                      >
                        {review.name}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          letterSpacing: 1,
                        }}
                      >
                        {review.location} · {review.date}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--gold)",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {review.rating}/5
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                          color: review.isApproved ? "#66bb6a" : "#ffb74d",
                        }}
                      >
                        {review.isApproved ? "Published" : "Pending"}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.8,
                      }}
                    >
                      {review.text}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() =>
                        handleReviewStatus(review.id, !review.isApproved)
                      }
                      style={{
                        padding: "7px 18px",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "var(--gold)";
                        e.target.style.color = "var(--gold)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.color = "var(--text-secondary)";
                      }}
                    >
                      {review.isApproved ? "Move to Pending" : "Approve"}
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(review.id)}
                      style={{
                        padding: "7px 18px",
                        border: "1px solid rgba(194,50,50,0.35)",
                        borderRadius: 20,
                        fontSize: 11,
                        cursor: "pointer",
                        color: "#e57373",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(194,50,50,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "address" && (
          <div style={panelStyle}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: 24,
              }}
            >
              Contact Information
            </p>
            <Field
              label="Address Line 1"
              value={addrForm.line1}
              onChange={(value) =>
                setAddrForm((current) => ({ ...current, line1: value }))
              }
            />
            <Field
              label="Address Line 2"
              value={addrForm.line2}
              onChange={(value) =>
                setAddrForm((current) => ({ ...current, line2: value }))
              }
            />
            <Field
              label="Phone Number"
              value={addrForm.phone}
              onChange={(value) =>
                setAddrForm((current) => ({ ...current, phone: value }))
              }
            />
            <Field
              label="Email Address"
              value={addrForm.email}
              onChange={(value) =>
                setAddrForm((current) => ({ ...current, email: value }))
              }
            />
            <Field
              label="Business Hours"
              value={addrForm.hours}
              onChange={(value) =>
                setAddrForm((current) => ({ ...current, hours: value }))
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
              }}
            >
              <Field
                label="Instagram"
                value={addrForm.social.instagram}
                onChange={(value) =>
                  setAddrForm((current) => ({
                    ...current,
                    social: { ...current.social, instagram: value },
                  }))
                }
                placeholder="https://www.instagram.com/..."
              />
            </div>

            <button
              onClick={handleSaveAddress}
              style={{
                padding: "11px 32px",
                background: "var(--text-primary)",
                color: "var(--text-invert)",
                border: "none",
                borderRadius: 24,
                fontSize: 11,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.3s",
                marginTop: 8,
              }}
              onMouseEnter={(e) => (e.target.style.background = "var(--gold)")}
              onMouseLeave={(e) =>
                (e.target.style.background = "var(--text-primary)")
              }
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
