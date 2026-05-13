import { useState } from "react";
import { motion } from "framer-motion";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80";

export default function InstagramPostCard({ post, onDetails }) {
  const [hovered, setHovered] = useState(false);
  const image = post.imageUrl || post.img || FALLBACK_IMAGE;
  const title = post.title || post.name || "Instagram Update";
  const description =
    post.caption || "View this update on our Instagram profile.";

  return (
    <motion.article
      className="editorial-card instagram-post-card"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        borderColor: hovered ? "var(--gold-light)" : "var(--border)",
      }}
    >
      <div
        className="instagram-post-card-media"
        style={{ aspectRatio: post.containsPerson ? "4/5" : "1/1" }}
      >
        <motion.img
          src={image}
          alt={title}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: post.containsPerson ? "contain" : "cover",
            objectPosition: post.containsPerson ? "center top" : "center",
            backgroundColor: post.containsPerson
              ? "rgba(0,0,0,0.02)"
              : "transparent",
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {post.isFeatured && (
          <div className="instagram-post-card-badge">
            Featured
          </div>
        )}
      </div>

      <div className="instagram-post-card-body">
        <div className="instagram-post-card-meta">
          <p className="instagram-post-card-date">{post.date || "Recent Post"}</p>

          {(post.instagramUrl || post.url) && (
            <a
              href={post.instagramUrl || post.url}
              target="_blank"
              rel="noreferrer"
              className="instagram-icon-link"
              aria-label={`Open ${title} on Instagram`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M9 7H17V15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        <h3 className="instagram-post-card-title">{title}</h3>

        <p className="instagram-post-card-caption">{description}</p>

        <div className="instagram-post-card-footer">
          <button
            type="button"
            className="instagram-text-button"
            onClick={() => onDetails?.(post)}
          >
            View Details
          </button>

          <span className="instagram-post-card-type">
            {post.isFeatured ? "Featured Edit" : "Latest Post"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
