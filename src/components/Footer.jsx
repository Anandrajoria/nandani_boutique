import { motion } from "framer-motion";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Collections", href: "#collections" },
  { label: "Reviews", href: "#ratings" },
  { label: "Instagram", href: "#instagram" },
  { label: "Contact", href: "#contact" },
];

const signatureNotes = ["Bridal", "Custom Blouses", "Occasion Wear"];

export default function Footer({ address, socialLinks = [] }) {
  const year = new Date().getFullYear();
  const location = [address?.line1, address?.line2].filter(Boolean).join(", ");

  return (
    <footer
      className="site-footer"
      style={{
        background: "var(--footer-bg)",
        transition: "background 0.4s",
      }}
    >
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-kicker">Nandani Boutique</p>
            <h2 className="footer-title">
              Crafted in Jaipur for celebrations that stay with you.
            </h2>
            <p className="footer-copy">
              Bespoke bridal, statement blouses, and custom occasion wear.
            </p>

            <div className="footer-signature-list">
              {signatureNotes.map((note) => (
                <span key={note} className="footer-signature-pill">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div className="footer-utility">
            <div className="footer-link-row">
              {navLinks.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ y: -2, color: "var(--gold)" }}
                  className="footer-link"
                >
                  {label}
                </motion.a>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <div className="footer-social-row">
                {socialLinks.map(({ key, name, href }) => (
                  <motion.a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2, color: "var(--gold)" }}
                    className="footer-social-link"
                  >
                    {name}
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-detail-cluster">
            {location && <span className="footer-detail">{location}</span>}
            {address?.phone && (
              <a href={`tel:${address.phone}`} className="footer-detail-link">
                {address.phone}
              </a>
            )}
            {address?.email && (
              <a
                href={`mailto:${address.email}`}
                className="footer-detail-link"
              >
                {address.email}
              </a>
            )}
          </div>

          <p className="footer-meta">
            Copyright {year} Nandani Boutique. All rights reserved.
          </p>

          <motion.a
            href="#"
            whileHover={{ y: -2, color: "var(--gold)" }}
            className="footer-top-link"
          >
            Back to top
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
