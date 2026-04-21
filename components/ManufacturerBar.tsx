'use client';

type Props = { t: (en: string, ar: string) => string };

const BRANDS = ['HIKVISION', 'DSPPA', 'LEGRAND', 'SCHNEIDER', 'KNX', 'GVS', 'SIB', 'EXTREME', 'TELEDATAONE', 'TENDA'];

export default function ManufacturerBar({ t }: Props) {
  // Triple the brands so -33.333% translate is a perfect seamless loop
  const row = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div style={{
      borderTop: '2px dashed #2a2a2a',
      background: '#2a2a2a',
      color: '#fff',
      padding: '9px 0',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Scrolling track */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 180px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 180px), transparent 100%)',
      }}>
        <div style={{
          display: 'flex',
          gap: 0,
          whiteSpace: 'nowrap',
          width: 'max-content',
          animation: 'mt-marquee 45s linear infinite',
        }}>
          {row.map((b, i) => {
            const brandIndex = i % BRANDS.length;
            return (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '3px 20px',
                borderRight: '1px solid rgba(255,255,255,.12)',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.2,
                fontFamily: 'monospace',
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: brandIndex % 5 === 0 ? '#E30613' : 'rgba(255,255,255,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                {b}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed label */}
      <div style={{
        flexShrink: 0,
        padding: '0 16px',
        borderLeft: '2px solid rgba(255,255,255,.2)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 2,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'monospace',
        lineHeight: 1.3,
        textAlign: 'center',
      }}>
        AUTHORIZED<br />DISTRIBUTOR
      </div>
    </div>
  );
}
