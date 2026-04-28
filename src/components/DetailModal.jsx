import { motion, AnimatePresence } from "framer-motion";
import { useViewport } from "../hooks";

export default function DetailModal({ item, onClose }) {
  const { isMobile, isSmallMobile } = useViewport();
  const isInstagram = item?.type === "instagram";
  const title = item?.name || "Instagram Post";
  const image =
    item?.img ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80";
  const description =
    item?.desc || "View this update on our Instagram profile.";
  const label = isInstagram ? "Instagram" : item?.category || "Collection";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(26,22,18,0.72)",
            backdropFilter: "blur(12px)",
            padding: isMobile ? 12 : 24,
          }}
        >
          <motion.div
            className="editorial-card"
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-surface)",
              borderRadius: 0,
              maxWidth: 620,
              width: "100%",
              overflow: "hidden",
              maxHeight: isMobile ? "92vh" : "auto",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)",
              transition: "background 0.4s, border-color 0.4s",
            }}
          >
            <div
              style={{
                aspectRatio: item?.containsPerson ? "4/5" : "16/9",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={image}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: item?.containsPerson ? "contain" : "cover",
                  objectPosition: item?.containsPerson
                    ? "center top"
                    : "center",
                  backgroundColor: item?.containsPerson
                    ? "rgba(0,0,0,0.02)"
                    : "transparent",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(26,22,18,0.45), transparent)",
                }}
              />
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 36,
                  height: 36,
                  borderRadius: 0,
                  background: "rgba(249,247,242,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--border)",
                  color: "var(--text-invert)",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: isMobile ? "20px 16px 20px" : "32px 36px 36px",
                overflowY: "auto",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {label}
              </p>
              {isInstagram && item?.date && (
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {item.date}
                </p>
              )}
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: isMobile ? 30 : 40,
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: 14,
                  lineHeight: 1.15,
                  transition: "color 0.4s",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  marginBottom: 28,
                  transition: "color 0.4s",
                }}
              >
                {description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexDirection: isSmallMobile ? "column" : "row",
                }}
              >
                {isInstagram ? (
                  <a
                    href={item?.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "13px 24px",
                      background: "var(--text-primary)",
                      color: "var(--text-invert)",
                      borderRadius: 0,
                      fontSize: 11,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      display: "block",
                      transition: "background 0.3s",
                      pointerEvents: item?.url ? "auto" : "none",
                      opacity: item?.url ? 1 : 0.65,
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "var(--gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "var(--text-primary)")
                    }
                  >
                    Open on Instagram
                  </a>
                ) : (
                  <a
                    href="#contact"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "13px 24px",
                      background: "var(--text-primary)",
                      color: "var(--text-invert)",
                      borderRadius: 0,
                      fontSize: 11,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      display: "block",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "var(--gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "var(--text-primary)")
                    }
                  >
                    Enquire Now
                  </a>
                )}
                <button
                  onClick={onClose}
                  style={{
                    padding: "13px 24px",
                    border: "1px solid var(--border)",
                    borderRadius: 0,
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
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
