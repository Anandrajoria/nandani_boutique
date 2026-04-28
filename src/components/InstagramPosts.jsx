import FadeSection from "./FadeSection";
import InstagramPostCard from "./InstagramPostCard";

function InstagramStat({ value, label }) {
  return (
    <div className="editorial-card instagram-stat-card">
      <p className="instagram-stat-value">{value}</p>
      <p className="instagram-stat-label">{label}</p>
    </div>
  );
}

function InstagramJournalItem({ post, onDetails }) {
  return (
    <button
      type="button"
      className="instagram-journal-item"
      onClick={() => onDetails?.(post)}
    >
      <div>
        <p className="instagram-journal-date">{post.date || "Recent Post"}</p>
        <p className="instagram-journal-title">{post.title || post.name}</p>
      </div>

      <span className="instagram-journal-arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17L17 7M9 7H17V15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

function FeaturedInstagramSpotlight({ post, onDetails }) {
  const image = post.imageUrl || post.img;

  return (
    <article className="editorial-card instagram-lead-card">
      <div className="instagram-lead-media">
        <img
          src={image}
          alt={post.title || post.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: post.containsPerson ? "contain" : "cover",
            objectPosition: post.containsPerson ? "center top" : "center",
            backgroundColor: post.containsPerson
              ? "rgba(0,0,0,0.03)"
              : "transparent",
          }}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80";
          }}
        />
        <div className="instagram-lead-badge">Instagram Spotlight</div>
        <div className="instagram-lead-number">01</div>
      </div>

      <div className="instagram-lead-copy">
        <div className="instagram-pill-row">
          <span className="instagram-pill">Featured Look</span>
          <span className="instagram-pill instagram-pill-muted">
            {post.date || "Recent Post"}
          </span>
        </div>

        <div>
          <h3 className="instagram-lead-title">{post.title || post.name}</h3>
          <p className="instagram-lead-caption">
            {post.caption || "View this update on our Instagram profile."}
          </p>
        </div>

        <div className="instagram-lead-highlights">
          <div className="instagram-highlight-card">
            <span className="instagram-highlight-label">Category</span>
            <strong>Instagram Edit</strong>
          </div>
          <div className="instagram-highlight-card">
            <span className="instagram-highlight-label">Format</span>
            <strong>{post.type === "video" ? "Video Post" : "Image Post"}</strong>
          </div>
          <div className="instagram-highlight-card">
            <span className="instagram-highlight-label">Focus</span>
            <strong>{post.containsPerson ? "Styled Look" : "Design Detail"}</strong>
          </div>
        </div>

        <div className="instagram-lead-actions">
          <button
            type="button"
            className="instagram-primary-button"
            onClick={() => onDetails?.(post)}
          >
            View Details
          </button>
          {(post.instagramUrl || post.url) && (
            <a
              href={post.instagramUrl || post.url}
              target="_blank"
              rel="noreferrer"
              className="instagram-secondary-button"
            >
              Open on Instagram
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function InstagramPosts({
  posts = [],
  onDetails,
  instagramLink = "",
}) {
  const featuredPosts = posts.filter((post) => post.isFeatured);
  const leadPost = featuredPosts[0] || posts[0] || null;
  const gridPosts = posts.filter((post) => post.id !== leadPost?.id);
  const journalPosts = gridPosts.slice(0, 3);
  const latestUpdate = leadPost?.date || (posts.length ? "Recent" : "Soon");

  return (
    <section
      className="instagram-section"
      id="instagram"
      style={{
        padding: "10vw 5vw",
        background: "var(--section-story)",
        transition: "background 0.4s",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <FadeSection>
          <div className="instagram-shell">
            <div className="instagram-intro">
              <div className="instagram-intro-copy">
                <p className="section-label">Instagram Highlights</p>
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(36px, 5vw, 64px)",
                    fontWeight: 300,
                    color: "var(--text-primary)",
                    lineHeight: 1.08,
                    transition: "color 0.4s",
                  }}
                >
                  Fresh From Our Feed
                </h2>
                <p className="instagram-intro-text">
                  A calmer, cleaner snapshot of our latest tailoring details,
                  bridal looks, and boutique moments from Instagram.
                </p>
              </div>

              <div className="editorial-card instagram-follow-card">
                <p className="instagram-side-eyebrow">Follow the Atelier</p>
                <p className="instagram-side-copy">
                  Bridal fittings, statement blouse backs, fresh custom work,
                  and the details between the final stitch and delivery.
                </p>

                {instagramLink ? (
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="instagram-primary-button"
                  >
                    Visit Instagram
                  </a>
                ) : (
                  <p className="instagram-side-note">
                    Fresh updates are curated here on the site.
                  </p>
                )}
              </div>
            </div>

            <div className="instagram-stats">
              <InstagramStat value={String(posts.length)} label="Recent Looks" />
              <InstagramStat
                value={String(featuredPosts.length)}
                label="Featured Edits"
              />
              <InstagramStat value={latestUpdate} label="Latest Update" />
            </div>
          </div>
        </FadeSection>

        {posts.length > 0 ? (
          <>
            <div className="instagram-layout">
              {leadPost && (
                <FadeSection delay={0.04}>
                  <FeaturedInstagramSpotlight post={leadPost} onDetails={onDetails} />
                </FadeSection>
              )}

              <div className="instagram-side-panel">
                <FadeSection delay={0.08}>
                  <div className="editorial-card instagram-journal-card">
                    <p className="instagram-side-eyebrow">Atelier Journal</p>
                    <h3 className="instagram-journal-heading">
                      What is landing in the feed right now.
                    </h3>

                    {journalPosts.length > 0 ? (
                      <div className="instagram-journal-list">
                        {journalPosts.map((post) => (
                          <InstagramJournalItem
                            key={post.id}
                            post={post}
                            onDetails={onDetails}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="instagram-side-note">
                        New boutique updates will appear here as soon as they are
                        published.
                      </p>
                    )}
                  </div>
                </FadeSection>
              </div>
            </div>

            {gridPosts.length > 0 && (
              <div className="instagram-grid">
                {gridPosts.map((post, index) => (
                  <FadeSection key={post.id} delay={0.12 + index * 0.05}>
                    <InstagramPostCard post={post} onDetails={onDetails} />
                  </FadeSection>
                ))}
              </div>
            )}
          </>
        ) : (
          <FadeSection delay={0.1}>
            <div className="editorial-card instagram-empty-state">
              Instagram posts will appear here soon.
            </div>
          </FadeSection>
        )}
      </div>
    </section>
  );
}
