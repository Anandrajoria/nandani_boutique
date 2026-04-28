import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeSection from "./FadeSection";
import { reviewsApi } from "../services/api";

const initialReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Jaipur",
    rating: 5,
    text: "Absolutely breathtaking work! My bridal lehenga was stitched to perfection. Every detail was exactly as I envisioned. The team truly understands what a bride wants.",
    date: "Dec 2024",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Ananya Mehta",
    location: "Mumbai",
    rating: 5,
    text: "I ordered a custom blouse and the craftsmanship is unreal. The fitting was flawless and they finished it ahead of schedule. Will definitely be coming back for more!",
    date: "Nov 2024",
    avatar: "AM",
  },
  {
    id: 3,
    name: "Ritu Agarwal",
    location: "Delhi",
    rating: 5,
    text: "The kurti they made for my sister's wedding was the talk of the event. Premium fabric, immaculate stitching, and a silhouette that was so flattering. Highly recommend.",
    date: "Oct 2024",
    avatar: "RA",
  },
];

// Star display (read-only)
function Stars({ rating, size = 16, color = "var(--gold)" }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= rating ? color : "none"}
          stroke={color}
          strokeWidth={1.5}
          style={{ flexShrink: 0 }}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

// Interactive star picker
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.button
          key={s}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          style={{
            background: "none",
            border: "none",
            padding: 2,
            cursor: "pointer",
          }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill={s <= (hovered || value) ? "var(--gold)" : "none"}
            stroke="var(--gold)"
            strokeWidth={1.5}
            style={{ transition: "fill 0.2s" }}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </motion.button>
      ))}
    </div>
  );
}

// Single review card
function ReviewCard({ review, delay }) {
  return (
    <FadeSection delay={delay}>
      <motion.div
        className="editorial-card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35 }}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          padding: "28px 24px",
          boxShadow: "var(--shadow-sm)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.35s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Quote mark */}
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 48,
            lineHeight: 0.8,
            color: "var(--gold)",
            opacity: 0.35,
            marginBottom: 4,
          }}
        >
          "
        </p>

        {/* Stars */}
        <Stars rating={review.rating} size={14} />

        {/* Text */}
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.85,
            flex: 1,
            transition: "color 0.4s",
          }}
        >
          {review.text}
        </p>

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--gold-dim)",
              border: "1px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              letterSpacing: 1,
              color: "var(--gold)",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {review.avatar}
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-primary)",
                transition: "color 0.4s",
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
          </div>
        </div>
      </motion.div>
    </FadeSection>
  );
}

// Summary bar (e.g. ★★★★★ — 90%)
function RatingBar({ star, percent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          width: 8,
          textAlign: "right",
        }}
      >
        {star}
      </span>
      <svg
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="var(--gold)"
        stroke="var(--gold)"
        strokeWidth={1.5}
        style={{ flexShrink: 0 }}
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "var(--border)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ height: "100%", background: "var(--gold)", borderRadius: 2 }}
        />
      </div>
      <span style={{ fontSize: 11, color: "var(--text-muted)", width: 32 }}>
        {percent}%
      </span>
    </div>
  );
}

export default function Ratings({ onShowMoreReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 0,
    text: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        const data = await reviewsApi.list();
        if (mounted && Array.isArray(data)) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error.message);
      }
    }

    loadReviews();
    return () => {
      mounted = false;
    };
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
    };
  });
  const visibleReviews = reviews.slice(0, 6);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!form.rating) {
      setError("Please select a star rating.");
      return;
    }
    if (form.text.trim().length < 10) {
      setError("Please write at least a short review.");
      return;
    }

    try {
      await reviewsApi.create({
        name: form.name.trim(),
        location: form.location.trim() || "India",
        rating: form.rating,
        text: form.text.trim(),
      });
    } catch (submitError) {
      setError(submitError.message || "Unable to submit review right now.");
      return;
    }
    setForm({ name: "", location: "", rating: 0, text: "" });
    setSubmitted(true);
    setError("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      className="ratings-section"
      id="ratings"
      style={{
        padding: "10vw 5vw",
        background: "var(--bg-warm)",
        transition: "background 0.4s",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <FadeSection>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: "5vw",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: 4,
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                What They Say
              </p>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(36px,5vw,64px)",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                  lineHeight: 1.15,
                  transition: "color 0.4s",
                }}
              >
                Worn with Love
              </h2>
            </div>

            {/* Summary score */}
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 64,
                  fontWeight: 300,
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                {avgRating}
              </p>
              <Stars rating={Math.round(parseFloat(avgRating))} size={16} />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                  marginTop: 6,
                }}
              >
                Based on {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </FadeSection>

        <div
          style={{
            display: "flex",
            gap: "4vw",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Left: rating bars + submit form */}
          <div style={{ flex: "0 0 280px", minWidth: 240 }}>
            <FadeSection delay={0.1}>
              {/* Distribution bars */}
              <div
                className="editorial-card"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  padding: "24px 20px",
                  marginBottom: 24,
                  transition: "background 0.4s, border-color 0.4s",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginBottom: 16,
                  }}
                >
                  Rating Breakdown
                </p>
                {ratingCounts.map(({ star, percent }) => (
                  <RatingBar key={star} star={star} percent={percent} />
                ))}
              </div>

              {/* Write a review */}
              <div
                className="editorial-card"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  padding: "24px 20px",
                  transition: "background 0.4s, border-color 0.4s",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 20,
                  }}
                >
                  Leave a Review
                </p>

                {[
                  {
                    label: "Your Name",
                    key: "name",
                    placeholder: "e.g. Priya Sharma",
                  },
                  {
                    label: "City",
                    key: "location",
                    placeholder: "e.g. Jaipur",
                  },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        borderRadius: 4,
                        fontSize: 13,
                        color: "var(--text-primary)",
                        fontFamily: "Jost, sans-serif",
                        outline: "none",
                        transition: "border-color 0.25s, background 0.4s",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--input-border)")
                      }
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    Your Rating
                  </label>
                  <StarPicker
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    Your Review
                  </label>
                  <textarea
                    placeholder="Share your experience..."
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      resize: "vertical",
                      background: "var(--input-bg)",
                      border: "1px solid var(--input-border)",
                      borderRadius: 4,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      fontFamily: "Jost, sans-serif",
                      outline: "none",
                      transition: "border-color 0.25s, background 0.4s",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--gold)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--input-border)")
                    }
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 12,
                        color: "#e57373",
                        marginBottom: 10,
                      }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {submitted && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 12,
                        color: "#66bb6a",
                        marginBottom: 10,
                      }}
                    >
                      Thank you. Your review has been received and will appear
                      after approval.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--text-primary)",
                    color: "var(--text-invert)",
                    border: "none",
                    borderRadius: 0,
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "var(--text-primary)")
                  }
                >
                  Submit Review
                </motion.button>
              </div>
            </FadeSection>
          </div>

          {/* Right: review cards grid */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {visibleReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} delay={i * 0.07} />
              ))}
            </div>

            {reviews.length > 6 && onShowMoreReviews && (
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onShowMoreReviews}
                  style={{
                    padding: "11px 20px",
                    borderRadius: 0,
                    border: "1px solid var(--gold)",
                    background: "transparent",
                    color: "var(--gold)",
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--gold)";
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--gold)";
                  }}
                >
                  Show more reviews
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
