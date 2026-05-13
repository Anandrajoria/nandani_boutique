import { motion } from "framer-motion";
import FadeSection from "./FadeSection";
import { useInView, useViewport } from "../hooks";

const storyImage = "/media/editorial/story-main.webp";
const storyDetailImage = "/media/editorial/story-detail.webp";

const stats = [
  { number: "500+", label: "Brides Dressed" },
  { number: "12", label: "Years of Craft" },
  { number: "4.9★", label: "Rating" },
];

export default function Story() {
  const [ref, isVisible] = useInView(0.08);
  const { isMobile, isSmallMobile } = useViewport();

  return (
    <section
      className="story-section"
      id="story"
      ref={ref}
      style={{
        padding: "10vw 5vw",
        background: "var(--section-story)",
        overflow: "hidden",
        transition: "background 0.4s",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          gap: "7vw",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Text */}
        <motion.div
          style={{ flex: "1 1 320px" }}
          initial={{ opacity: 0, x: -56, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: isSmallMobile ? 2.5 : 4,
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Our Story
          </p>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile
                ? "clamp(30px,9vw,44px)"
                : "clamp(32px,4.5vw,60px)",
              fontWeight: 300,
              lineHeight: 1.25,
              color: "var(--text-primary)",
              marginBottom: 28,
              transition: "color 0.4s",
            }}
          >
            Every thread
            <br />
            <em style={{ color: "var(--gold)" }}>tells a story.</em>
          </h2>
          <p
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "var(--text-secondary)",
              lineHeight: 1.9,
              marginBottom: 18,
              maxWidth: 460,
              transition: "color 0.4s",
            }}
          >
            We don't just stitch clothes — we craft identity. Born in the lanes
            of Jaipur, each creation carries the legacy of master artisans and
            the dreams of the women who wear them.
          </p>
          <p
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "var(--text-secondary)",
              lineHeight: 1.9,
              marginBottom: isMobile ? 30 : 44,
              maxWidth: 460,
              transition: "color 0.4s",
            }}
          >
            From hand-embroidered bridal lehengas to effortlessly modern kurtis,
            every garment is a dialogue between tradition and today.
          </p>

          <div style={{ display: "flex", gap: "6vw", flexWrap: "wrap" }}>
            {stats.map(({ number, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
              >
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 34 : 40,
                    fontWeight: 500,
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}
                >
                  {number}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 2.5,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          style={{
            flex: "1 1 320px",
            position: "relative",
            minWidth: isSmallMobile ? 0 : 280,
          }}
          initial={{ opacity: 0, x: 56, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 1.1,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div
            style={{
              borderRadius: 4,
              overflow: "hidden",
              aspectRatio: "3/4",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <img
              src={storyImage}
              alt="Craftsmanship"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: isMobile ? 16 : 48,
              right: isMobile ? 8 : -28,
              width: isMobile ? "38%" : "42%",
              aspectRatio: "1/1",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <img
              src={storyDetailImage}
              alt="Detail"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: -24,
                left: -24,
                width: 80,
                height: 80,
                border: "1px solid var(--gold)",
                opacity: 0.25,
              }}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              position: "absolute",
              bottom: isMobile ? 10 : -16,
              right: isMobile ? 10 : -12,
              background: "var(--bg-invert)",
              color: "var(--text-invert)",
              padding: isMobile ? "12px 14px" : "16px 20px",
              borderRadius: 2,
              maxWidth: isMobile ? 150 : 180,
              transition: "background 0.4s",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 13,
                fontStyle: "italic",
                lineHeight: 1.6,
                color: "var(--text-invert-sub)",
              }}
            >
              "Crafted with love, worn with pride."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
