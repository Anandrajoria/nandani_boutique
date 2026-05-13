import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollY, useViewport } from "../hooks";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Collections", href: "#collections" },
  { label: "Contact", href: "#contact" },
];

export default function Nav({ page, setPage }) {
  const scrollY = useScrollY();
  const { isTablet, isMobile } = useViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = scrollY > 40;
  const isSecondaryPage = page !== "home";

  const handleLinkClick = () => {
    if (page === "admin") setPage("home");
    if (isTablet) setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="site-nav"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: isTablet ? 64 : 70,
        padding: isMobile ? "0 4vw" : "0 5vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <button
        onClick={() => {
          setPage("home");
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: isMobile ? 20 : 24,
          fontWeight: 600,
          letterSpacing: isMobile ? 2 : 3,
          color: "var(--text-primary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 0.4s",
        }}
      >
        Nandani Boutique
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 12 : 20,
        }}
      >
        {!isTablet &&
          navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleLinkClick}
              style={{
                fontSize: 11,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-secondary)";
              }}
            >
              {label}
            </a>
          ))}

        <ThemeToggle />

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setPage(isSecondaryPage ? "home" : "admin");
            if (isTablet) setMobileMenuOpen(false);
          }}
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: isSecondaryPage ? "var(--text-invert)" : "var(--gold)",
            background: isSecondaryPage ? "var(--gold)" : "transparent",
            border: "1px solid var(--gold)",
            padding: isMobile ? "7px 14px" : "7px 18px",
            borderRadius: 0,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          {isSecondaryPage ? "<- Home" : "Admin"}
        </motion.button>

        {isTablet && (
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "7px 14px",
              background: "transparent",
            }}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        )}
      </div>

      {isTablet && mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--nav-bg)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(14px)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "12px 4vw",
          }}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleLinkClick}
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                padding: "10px 0",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  );
}
