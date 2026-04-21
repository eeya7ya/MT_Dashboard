'use client';

type Props = {
  title: string;
  desc: string;
  url: string;
  icon: string;
  t: (en: string, ar: string) => string;
};

export default function LauncherCard({ title, desc, url, icon, t }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <a href={url} target="_blank" rel="noreferrer"
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{
          width: 520, border: '2px solid #2a2a2a', background: '#fff', padding: 36,
          borderRadius: 4, boxShadow: '6px 6px 0 #2a2a2a', position: 'relative',
          transform: 'rotate(-.4deg)', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <div style={{
              width: 72, height: 72, border: '2px solid #2a2a2a',
              background: '#E30613', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 800,
              transform: 'rotate(-3deg)', boxShadow: '3px 3px 0 #2a2a2a', flexShrink: 0,
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 11, color: '#E30613', fontWeight: 800, letterSpacing: 1.5 }}>
                {t('APP', 'تطبيق')}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>{title}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.8, marginBottom: 22 }}>{desc}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: '2px solid #2a2a2a', background: '#E30613', color: '#fff',
            padding: '10px 18px', fontWeight: 800, fontSize: 14, letterSpacing: 0.5,
            boxShadow: '3px 3px 0 #2a2a2a',
          }}>
            <span>{t('OPEN APP', 'فتح التطبيق')}</span>
            <span style={{ fontSize: 18, lineHeight: 1 }}>↗</span>
          </div>
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 14, fontFamily: 'monospace' }}>{url}</div>
        </div>
      </a>
    </div>
  );
}
