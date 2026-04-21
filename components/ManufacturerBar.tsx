'use client';

type Props = { t: (en: string, ar: string) => string };

const BRANDS = ['HIKVISION', 'DSPPA', 'LEGRAND', 'SCHNEIDER', 'KNX', 'GVS', 'SIB', 'EXTREME', 'TELEDATAONE', 'TENDA'];

export default function ManufacturerBar({ t }: Props) {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div style={{
      borderTop: '2px dashed #2a2a2a', background: '#2a2a2a', color: '#fff',
      padding: '10px 0', overflow: 'hidden', position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', gap: 36, whiteSpace: 'nowrap', width: 'max-content',
        animation: 'mt-marquee 40s linear infinite',
      }}>
        {row.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '4px 14px',
            border: '1.5px solid rgba(255,255,255,.25)', borderRadius: 3,
            fontSize: 12, fontWeight: 800, letterSpacing: 1,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: i % 4 === 0 ? '#E30613' : '#fff',
              border: '1.5px solid #fff', display: 'inline-block', flexShrink: 0,
            }} />
            {b}
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, padding: '0 14px',
        display: 'flex', alignItems: 'center', background: '#2a2a2a',
        borderLeft: '1.5px dashed rgba(255,255,255,.2)',
        fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.75,
      }}>
        {t('AUTHORIZED DISTRIBUTOR', 'موزع معتمد')}
      </div>
    </div>
  );
}
