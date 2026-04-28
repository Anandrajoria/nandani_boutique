import FadeSection from './FadeSection';
import CategoryCard from './CategoryCard';

export default function Categories({ categories, onDetails }) {
  return (
    <section className="collections-section" id="collections" style={{ padding: '10vw 5vw', background: 'var(--section-cat)', transition: 'background 0.4s' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <FadeSection>
          <div style={{ textAlign: 'center', marginBottom: '5vw' }}>
            <p style={{ fontSize: 11, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 14 }}>
              Curated for You
            </p>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px,5vw,68px)', fontWeight: 300,
              color: 'var(--text-primary)', lineHeight: 1.15, transition: 'color 0.4s',
            }}>
              Our Collections
            </h2>
            <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: '20px auto 0' }} />
          </div>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
          {categories.map((item, i) => (
            <FadeSection key={item.id} delay={i * 0.1}>
              <CategoryCard item={item} onDetails={onDetails} />
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}
