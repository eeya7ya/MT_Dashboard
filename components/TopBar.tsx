'use client';

type Props = {
  title: string;
  lang: string;
  setLang: (l: string) => void;
  t: (en: string, ar: string) => string;
};

export default function TopBar({ title, lang, setLang, t }: Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div style={{
      height: 64, borderBottom: '2px dashed #2a2a2a', padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fafaf7', flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{title}.</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>
          {t('Ahmad · ', 'أحمد · ')}{dateStr}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          width: 240, height: 34, border: '2px solid #2a2a2a', background: '#fff',
          display: 'flex', alignItems: 'center', padding: '0 10px',
          fontSize: 12, borderRadius: 3, color: '#2a2a2a', opacity: 0.55,
        }}>
          {t('⌕  search quotes, clients, SKUs…', '⌕  ابحث…')}
        </div>
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={{
            width: 50, height: 34, border: '2px solid #2a2a2a', background: '#E30613',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, borderRadius: 3, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
          {lang === 'en' ? 'AR' : 'EN'}
        </button>
        {/* Bell */}
        <div style={{
          width: 34, height: 34, border: '2px solid #2a2a2a', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, borderRadius: 3, cursor: 'pointer',
        }}>🔔</div>
      </div>
    </div>
  );
}
