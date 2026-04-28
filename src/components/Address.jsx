import { motion } from "framer-motion";
import FadeSection from "./FadeSection";

export default function Address({ address, socialLinks = [] }) {
  const contactItems = [
    { icon: "📍", value: `${address.line1}, ${address.line2}` },
    { icon: "📞", value: address.phone },
    { icon: "✉", value: address.email },
    { icon: "🕐", value: address.hours },
  ];

  return (
    <section
      className="contact-section"
      id="contact"
      style={{
        padding: "10vw 5vw",
        background: "var(--section-addr)",
        transition: "background 0.4s",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <FadeSection>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Visit Us
          </p>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(32px,4.5vw,60px)",
              fontWeight: 300,
              color: "var(--contact-heading)",
              marginBottom: "5vw",
              lineHeight: 1.2,
            }}
          >
            Find Our Atelier
          </h2>
        </FadeSection>

        <div
          style={{
            display: "flex",
            gap: "6vw",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <FadeSection
            delay={0.1}
            direction="left"
            style={{ flex: "1 1 260px", minWidth: 220 }}
          >
            <div>
              {contactItems.map(({ icon, value }) => (
                <div
                  key={value}
                  style={{
                    display: "flex",
                    gap: 18,
                    marginBottom: 24,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{ fontSize: 18, lineHeight: 1.5, flexShrink: 0 }}
                  >
                    {icon}
                  </span>
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--contact-copy)",
                      lineHeight: 1.75,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "var(--gold)",
                  margin: "32px 0 28px",
                }}
              />
              {socialLinks.length > 0 && (
                <>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: 3,
                      color: "#6b6560",
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    Follow Us
                  </p>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {socialLinks.map(({ name, href }) => (
                      <motion.a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.08, color: "var(--gold)" }}
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#6b6560",
                          transition: "color 0.3s",
                        }}
                      >
                        {name}
                      </motion.a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </FadeSection>

          <FadeSection
            delay={0.2}
            direction="right"
            style={{ flex: "2 1 400px", minWidth: 280 }}
          >
            <div
              style={{
                borderRadius: 4,
                overflow: "hidden",
                height: 320,
                border: "1px solid var(--border-subtle)",
              }}
            >
              <iframe
                src="https://www.google.com/maps?q=26.99131493030999,75.73939424481938&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(15%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nandani Boutique Location"
              />
            </div>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}
