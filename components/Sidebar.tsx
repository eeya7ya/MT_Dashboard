'use client';

type App = {
  id: string;
  icon: string;
  label: string;
  launcher?: boolean;
  url?: string;
  soon?: boolean;
};

type Props = {
  apps: App[];
  active: string;
  setActive: (id: string) => void;
  isAr: boolean;
  t: (en: string, ar: string) => string;
};

export default function Sidebar({ apps, active, setActive, isAr, t }: Props) {
  return (
    <div style={{
      borderRight: `2px dashed #2a2a2a`,
      padding: '22px 18px',
      position: 'relative',
      zIndex: 1,
      background: '#f4f1ea',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <div style={{
          width: 42, height: 42, border: '2px solid #2a2a2a', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 18, transform: 'rotate(-2deg)', flexShrink: 0,
        }}>
          M<span style={{ color: '#E30613' }}>T</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.5, lineHeight: 1.1 }}>
          MAGIC<br />TECH
          <div style={{ fontWeight: 400, fontSize: 10, opacity: 0.6, marginTop: 2 }}>
            {t('Presales Hub', 'مركز ما قبل البيع')}
          </div>
        </div>
      </div>

      {/* Apps label */}
      <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.55, letterSpacing: 1.5, marginBottom: 8 }}>
        {t('APPS', 'التطبيقات')}
      </div>

      {/* App items */}
      {apps.map((a) => {
        if (a.launcher && a.url) {
          return (
            <a key={a.id} href={a.url} target="_blank" rel="noreferrer"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 10 }}>
              <div style={{
                border: '2px solid #2a2a2a', background: '#fff', borderRadius: 4,
                padding: '12px 12px 10px', position: 'relative',
                boxShadow: '3px 3px 0 #E30613', cursor: 'pointer',
                transform: 'rotate(-.3deg)',
                transition: 'transform 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 34, height: 34, border: '2px solid #2a2a2a',
                    background: '#E30613', color: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, transform: 'rotate(-3deg)', flexShrink: 0,
                  }}>{a.icon}</div>
                  <div style={{ flex: 1, lineHeight: 1.15, minWidth: 0 }}>
                    <div style={{ fontSize: 9, color: '#E30613', fontWeight: 800, letterSpacing: 1.2 }}>
                      {t('LAUNCH APP', 'فتح التطبيق')}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{a.label}</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: '1.5px dashed #2a2a2a', paddingTop: 7, marginTop: 2,
                }}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', opacity: 0.55, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.url.replace('https://', '').replace(/\/$/, '')}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: '#E30613',
                    display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
                  }}>{t('OPEN', 'فتح')} ↗</span>
                </div>
              </div>
            </a>
          );
        }

        return (
          <div key={a.id}
            onClick={() => !a.soon && setActive(a.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              fontSize: 13, borderRadius: 3, marginBottom: 5,
              background: active === a.id ? '#fff' : 'transparent',
              border: active === a.id ? '2px solid #2a2a2a' : '2px solid transparent',
              fontWeight: active === a.id ? 700 : 500,
              boxShadow: active === a.id ? '2px 2px 0 #E30613' : 'none',
              cursor: a.soon ? 'default' : 'pointer',
              opacity: a.soon ? 0.45 : 1,
            }}>
            <span style={{
              width: 16, textAlign: 'center',
              color: active === a.id ? '#E30613' : '#2a2a2a',
              fontWeight: 800, flexShrink: 0,
            }}>{a.icon}</span>
            <span style={{ flex: 1 }}>{a.label}</span>
            {a.soon && <span style={{ fontSize: 9, opacity: 0.7 }}>{t('soon', 'قريبًا')}</span>}
          </div>
        );
      })}

      {/* User card */}
      <div style={{ marginTop: 26, fontSize: 10, fontWeight: 700, opacity: 0.55, letterSpacing: 1.5, marginBottom: 8 }}>
        {t('YOU', 'أنت')}
      </div>
      <div style={{ border: '2px dashed #2a2a2a', padding: 10, borderRadius: 3, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', border: '2px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fafaf7', fontWeight: 800, fontSize: 11, flexShrink: 0,
          }}>YK</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Yahya Khaled</div>
            <div style={{ fontSize: 10, opacity: 0.65 }}>{t('Senior Presales', 'ما قبل البيع')}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16, fontSize: 10, opacity: 0.5 }}>
        v1.0 · {t('Magic Tech Presales Hub', 'مركز ما قبل البيع')}
      </div>
    </div>
  );
}
