import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FadeSection from "../components/FadeSection";
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

function ReviewCard({ review, delay }) {
  return (
    <FadeSection delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35 }}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "28px 24px",
          boxShadow: "var(--shadow-sm)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.35s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
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

        <Stars rating={review.rating} size={14} />

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

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);

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
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "110px 5vw 80px",
        background: "var(--bg-warm)",
        transition: "background 0.4s",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
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
                Every Review
              </p>
              <h1
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(40px,5vw,68px)",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                  transition: "color 0.4s",
                }}
              >
                All Ratings in One Place
              </h1>
            </div>

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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} delay={index * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
