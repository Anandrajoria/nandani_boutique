import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { dynamicWords } from "../data";
import { useViewport } from "../hooks";

const heroImage = "/media/editorial/santosh.webp";

export default function Hero({ socialLinks = [] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [lineExpanded, setLineExpanded] = useState(false);
  const [split, setSplit] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 20 });
  const imgX = useTransform(springX, [-400, 400], [10, -10]);
  const imgY = useTransform(springY, [-400, 400], [6, -6]);
  const textX = useTransform(springX, [-400, 400], [-6, 6]);
  const textY = useTransform(springY, [-400, 400], [-4, 4]);

  useEffect(() => {
    const t1 = setTimeout(() => setLineExpanded(true), 300);
    const t2 = setTimeout(() => setSplit(true), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setWordIndex((i) => (i + 1) % dynamicWords.length), 500);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const splitT = { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] };
  const { isTablet, isMobile, isSmallMobile } = useViewport();

  return (
    <section
      className="hero-section"
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(135deg, var(--hero-grad-1) 0%, var(--hero-grad-2) 40%, var(--hero-grad-3) 70%, var(--hero-grad-1) 100%)",
          transition: "background 0.4s",
        }}
      />

      {/* Orbs */}
      {!isMobile && (
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: isTablet ? 300 : 420,
            height: isTablet ? 300 : 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--gold-dim) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}
      {!isMobile && (
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          style={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: isTablet ? 240 : 320,
            height: isTablet ? 240 : 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--gold-dim) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Center line */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: lineExpanded ? (isMobile ? "80vw" : "55vw") : 0,
          opacity: lineExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--gold), transparent)",
          boxShadow: "0 0 8px var(--gold-dim)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          padding: isMobile ? "96px 5vw 72px" : "100px 5vw 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: isMobile ? 28 : 48,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TEXT */}
        <motion.div
          style={{
            flex: "1 1 360px",
            minWidth: isSmallMobile ? 0 : 280,
            x: isMobile ? 0 : textX,
            y: isMobile ? 0 : textY,
          }}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.93 }}
          animate={split ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
          transition={{ ...splitT, delay: 0.15 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={split ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontSize: isSmallMobile ? 11 : 13,
              letterSpacing: isSmallMobile ? 2.5 : 3.5,
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Welcome to couture
          </motion.p>

          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile
                ? "clamp(38px,11vw,56px)"
                : "clamp(52px,6.5vw,96px)",
              fontWeight: 300,
              lineHeight: 1.08,
              color: "var(--text-primary)",
              marginBottom: 8,
              transition: "color 0.4s",
            }}
          >
            We create
          </h1>

          <div
            style={{
              height: isMobile
                ? "clamp(44px,11vw,62px)"
                : "clamp(58px,7vw,104px)",
              overflow: "hidden",
              marginBottom: isMobile ? 20 : 28,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={wordIndex}
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: isMobile
                    ? "clamp(38px,11vw,56px)"
                    : "clamp(52px,6.5vw,96px)",
                  fontWeight: 500,
                  color: "var(--gold)",
                  fontStyle: "italic",
                  lineHeight: 1.08,
                }}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {dynamicWords[wordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={split ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: isMobile ? 24 : 36,
              maxWidth: 460,
              transition: "color 0.4s",
            }}
          >
            Bespoke tailoring rooted in tradition. Every stitch a promise, every
            garment an heirloom crafted for the woman who knows her worth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={split ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{
              display: "flex",
              gap: isSmallMobile ? 14 : 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {socialLinks.map(({ name, href }) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.08, color: "var(--gold)" }}
                style={{
                  fontSize: 10,
                  letterSpacing: isSmallMobile ? 1.5 : 2.5,
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  transition: "color 0.3s",
                }}
              >
                {name}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          style={{
            flex: "1 1 360px",
            minWidth: isSmallMobile ? 0 : 280,
            position: "relative",
            x: isMobile ? 0 : imgX,
            y: isMobile ? 0 : imgY,
          }}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.93 }}
          animate={split ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
          transition={{ ...splitT, delay: 0.25 }}
        >
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 90,
                height: 90,
                border: "1px solid var(--gold)",
                borderRadius: 2,
                opacity: 0.3,
                zIndex: 0,
              }}
            />
          )}

          <motion.div
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              borderRadius: 4,
              overflow: "hidden",
              aspectRatio: "4/5",
              position: "relative",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <img
              src={heroImage}
              alt="Bridal Lehenga"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(26,26,26,0.28), transparent 60%)",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={split ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              position: "absolute",
              bottom: isMobile ? 12 : 28,
              left: isMobile ? 12 : -20,
              background: "var(--badge-bg)",
              border: "1px solid var(--badge-border)",
              padding: isMobile ? "10px 14px" : "14px 22px",
              borderRadius: 2,
              boxShadow: "var(--shadow-md)",
              transition: "background 0.4s, border-color 0.4s",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 12 : 13,
                color: "var(--gold)",
                letterSpacing: 1.5,
              }}
            >
              Since 2012
            </p>
            <p
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "var(--text-secondary)",
                letterSpacing: isMobile ? 1.2 : 2,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Jaipur, Rajasthan
            </p>
          </motion.div>

          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: -24,
                left: -24,
                width: 64,
                height: 64,
                border: "1px solid var(--gold)",
                opacity: 0.2,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={split ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        style={{
          position: "absolute",
          bottom: isMobile ? 18 : 32,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, var(--gold), transparent)",
            margin: "0 auto 8px",
          }}
        />
        <p
          style={{
            fontSize: 9,
            letterSpacing: 4,
            color: "var(--gold)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
