import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        width: 48,
        height: 24,
        borderRadius: 999,
        background: isDark
          ? "linear-gradient(90deg, var(--gold), var(--bronze))"
          : "linear-gradient(90deg, rgba(249,247,242,0.96), rgba(238,234,226,0.96))",
        border: "1px solid var(--gold)",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.35s",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 6,
          fontSize: 8,
          opacity: isDark ? 0 : 0.8,
          transition: "opacity 0.3s",
          lineHeight: 1,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        Sun
      </span>
      <span
        style={{
          position: "absolute",
          right: 6,
          fontSize: 8,
          opacity: isDark ? 0.85 : 0,
          transition: "opacity 0.3s",
          lineHeight: 1,
          color: isDark ? "#fff6ef" : "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        Moon
      </span>

      <motion.div
        layout
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: isDark ? "#fff" : "var(--gold)",
          boxShadow: isDark
            ? "0 0 0 1px rgba(255,255,255,0.2)"
            : "0 4px 10px rgba(46,74,62,0.20)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      />
    </motion.button>
  );
}
