'use client';

type Props = {
  lang: string;
  t: (en: string, ar: string) => string;
};

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: '2px solid #2a2a2a', background: '#fff', padding: 14, borderRadius: 4,
      boxShadow: '3px 3px 0 #2a2a2a',
    }}>{children}</div>
  );
}

function Pill({ children, red }: { children: React.ReactNode; red?: boolean }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
      border: `1.5px solid ${red ? '#E30613' : '#2a2a2a'}`,
      color: red ? '#E30613' : '#2a2a2a',
      padding: '2px 8px', borderRadius: 10, display: 'inline-block',
    }}>{children}</span>
  );
}

function WobblyCircle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 37; i++) {
    const a = (i / 36) * Math.PI * 2;
    const j = (Math.sin(i * 13.7) + Math.cos(i * 7.1)) * 1.5;
    pts.push(`${cx + (r + j) * Math.cos(a)},${cy + (r + j) * Math.sin(a)}`);
  }
  return <polyline fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity=".7" points={pts.join(' ')} />;
}

function RolePie({ isAr }: { isAr: boolean }) {
  const segs = [
    { l: isAr ? 'تصميم' : 'Design',   v: 35, c: '#E30613' },
    { l: isAr ? 'عروض' : 'Quotes',    v: 25, c: '#2a2a2a' },
    { l: isAr ? 'زيارات' : 'Visits',  v: 15, c: '#fff' },
    { l: isAr ? 'تدريب' : 'Training', v: 15, c: '#888' },
    { l: isAr ? 'دعم' : 'Support',    v: 10, c: '#ccc' },
  ];
  let a = -90;
  const R = 90;
  return (
    <svg viewBox="-100 -100 200 200" width="100%" height="100%">
      {segs.map((s, i) => {
        const ang = (s.v / 100) * 360;
        const large = ang > 180 ? 1 : 0;
        const a2 = a + ang;
        const r1 = (a * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
        const x1 = R * Math.cos(r1), y1 = R * Math.sin(r1);
        const x2 = R * Math.cos(r2), y2 = R * Math.sin(r2);
        const d = `M0,0 L${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} Z`;
        a = a2;
        return <path key={i} d={d} fill={s.c} stroke="#2a2a2a" strokeWidth="1.5" />;
      })}
      <circle r="40" fill="#fafaf7" stroke="#2a2a2a" strokeWidth="1.5" />
      <text textAnchor="middle" y="-2" fontSize="12" fontWeight="800" fontFamily="'Kalam',cursive">
        {isAr ? 'دور' : 'ROLE'}
      </text>
      <text textAnchor="middle" y="12" fontSize="9" opacity=".7" fontFamily="'Kalam',cursive">
        {isAr ? 'المزيج' : 'mix'}
      </text>
    </svg>
  );
}

export default function OverviewOrbit({ lang, t }: Props) {
  const isAr = lang === 'ar';
  // Content area: 1440 - 230px sidebar - 48px padding = 1162px
  const W = 1162, H = 780;
  const cx = W / 2, cy = H / 2 + 10;
  const R1 = 210;

  const core = [
    { label: t('Quotation Designer', 'مصمم العروض'),  a: -90,  hot: true,  url: 'https://magictech-quotation.dev' },
    { label: t('Pricing Sheets', 'قوائم الأسعار'),    a: -30,  hot: true,  url: 'https://pricing-sheet-six.vercel.app/' },
    { label: t('Site Surveys', 'المسوحات'),            a: 30,   hot: false },
    { label: t('BOQ Library', 'مكتبة BOQ'),            a: 90,   hot: false },
    { label: t('Tenders', 'المناقصات'),                a: 150,  hot: false },
    { label: t('Clients', 'العملاء'),                  a: 210,  hot: false },
  ];

  const polar = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const responsibilities = [
    [t('Requirements gathering', 'جمع المتطلبات'),    t('read tenders, BOQs, consultant specs', 'المناقصات والمواصفات')],
    [t('System design', 'تصميم النظام'),              t('low-voltage architecture, diagrams', 'معمارية التيار الخفيف')],
    [t('Product selection', 'اختيار المنتجات'),       t('match SKUs across partner brands', 'مطابقة الأصناف')],
    [t('BOQ & quotation', 'جداول الكميات والعروض'),   t('quantities, pricing, margins', 'كميات وأسعار وهوامش')],
    [t('Technical submittals', 'المستندات الفنية'),   t('datasheets, compliance, drawings', 'ملفات الاعتماد')],
    [t('Site surveys', 'المسوحات الميدانية'),         t('walkthroughs and as-built checks', 'زيارات ميدانية')],
    [t('Consultant defense', 'الدفاع أمام الاستشاري'), t('clarifications, VE proposals', 'الاستفسارات والبدائل')],
    [t('Handover to projects', 'التسليم للمشاريع'),   t('package everything for execution', 'تسليم الحزمة للتنفيذ')],
  ];

  const systems = [
    ['CCTV & video', 'كاميرات'], ['Access control', 'التحكم بالدخول'], ['Intrusion alarm', 'الإنذار'],
    ['Public address', 'الصوت العام'], ['Intercom', 'الاتصال الداخلي'], ['Structured cabling', 'الكابلات المنظّمة'],
    ['Network / Wi-Fi', 'الشبكات'], ['KNX automation', 'أتمتة KNX'], ['Smart lighting', 'إنارة ذكية'],
    ['LV power', 'التيار الخفيف'], ['Nurse call', 'نداء المرضى'], ['IPTV', 'IPTV'],
  ];

  const skills = [
    ['Technical knowledge', 95, 'المعرفة الفنية'],
    ['BOQ & estimation', 88, 'الجداول والتقدير'],
    ['AutoCAD / Revit', 72, 'الرسم الهندسي'],
    ['Consultant relations', 80, 'علاقات الاستشاريين'],
    ['Commercial acumen', 70, 'الحس التجاري'],
    ['Bilingual EN/AR', 92, 'ثنائي اللغة'],
  ] as [string, number, string][];

  return (
    <div style={{ position: 'relative', width: '100%', height: 780, overflow: 'hidden' }}>

      {/* Left rail */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 255, zIndex: 3 }}>
        <Panel>
          <Pill red>{t('THE ROLE', 'الدور')}</Pill>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8, lineHeight: 1.15 }}>
            {t('Presales Engineer', 'مهندس ما قبل البيع')}
          </div>
          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2, letterSpacing: 0.3 }}>
            {t('Light-current · IT · Home Automation', 'التيار الخفيف · تقنية المعلومات · الأتمتة')}
          </div>
          <div style={{ height: 1, borderTop: '1.5px dashed #2a2a2a', margin: '10px 0' }} />
          <div style={{ fontSize: 11, lineHeight: 1.55, opacity: 0.88 }}>
            {t(
              'The technical bridge between the sales team, the client, and our partner manufacturers. Studies tender documents and site drawings, designs a compliant system, selects the right products from the authorized brands, prepares the BOQ and technical submittals, and defends the solution with the consultant until handover to projects.',
              'الجسر التقني بين فريق المبيعات والعميل والشركات المصنّعة. يدرس وثائق المناقصة والمخططات، ويصمم نظامًا مطابقًا للمواصفات، ويختار المنتجات من العلامات المعتمدة، ويُعدّ جداول الكميات والمستندات الفنية، ويدافع عن الحل أمام الاستشاري حتى التسليم.'
            )}
          </div>
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Panel>
            <Pill>{t('KEY RESPONSIBILITIES', 'المهام الرئيسية')}</Pill>
            <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', fontSize: 10.5, lineHeight: 1.5 }}>
              {responsibilities.map((row, i) => (
                <li key={i} style={{
                  padding: '4px 0',
                  borderBottom: i < responsibilities.length - 1 ? '1px dashed #ddd' : 'none',
                  display: 'flex', gap: 6,
                }}>
                  <span style={{ color: '#E30613', fontWeight: 800, flexShrink: 0 }}>·</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{row[0]}</div>
                    <div style={{ opacity: 0.65, fontSize: 9.5 }}>{row[1]}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* Right rail */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 255, zIndex: 3 }}>
        <Panel>
          <Pill>{t('SYSTEMS COVERED', 'الأنظمة المغطاة')}</Pill>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {systems.map((s, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700,
                border: '1.5px solid #2a2a2a', padding: '3px 7px',
                borderRadius: 10, background: '#fff',
              }}>{t(s[0], s[1])}</span>
            ))}
          </div>
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Panel>
            <Pill red>{t('CORE SKILLS', 'المهارات الأساسية')}</Pill>
            <div style={{ marginTop: 8 }}>
              {skills.map(([k, v, ar], i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600 }}>{t(k, ar)}</span>
                    <span style={{ opacity: 0.65 }}>{v}%</span>
                  </div>
                  <div style={{ height: 7, border: '1.5px solid #2a2a2a', position: 'relative' }}>
                    <div style={{ width: `${v}%`, height: '100%', background: i === 0 ? '#E30613' : '#2a2a2a' }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Rotating orbit layer */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: W, height: H,
        animation: 'mt-orbit-spin 80s linear infinite',
        transformOrigin: `${cx}px ${cy}px`,
      }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <WobblyCircle cx={cx} cy={cy} r={R1} />
          {core.map((c, i) => {
            const p = polar(R1, c.a);
            return (
              <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 5" opacity=".4" />
            );
          })}
        </svg>
        {core.map((c, i) => {
          const p = polar(R1, c.a);
          const inner = (
            <div style={{
              border: '2px solid #2a2a2a',
              background: c.hot ? '#E30613' : '#fff',
              color: c.hot ? '#fff' : '#2a2a2a',
              padding: '8px 10px', textAlign: 'center', fontSize: 12, fontWeight: 700,
              borderRadius: 3, boxShadow: '2px 2px 0 #2a2a2a',
              cursor: c.url ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
            }}>
              {c.label}{c.hot ? ' ↗' : ''}
            </div>
          );
          return (
            <div key={i} style={{
              position: 'absolute',
              left: p.x - 70, top: p.y - 24,
              width: 140,
              animation: 'mt-orbit-counter 80s linear infinite',
              transformOrigin: 'center center',
            }}>
              {c.url
                ? <a href={c.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
                : inner
              }
            </div>
          );
        })}
      </div>

      {/* Center pie — static, above rotating layer */}
      <div style={{
        position: 'absolute',
        left: cx - 95, top: cy - 95,
        width: 190, height: 190,
        zIndex: 4,
      }}>
        <RolePie isAr={isAr} />
      </div>
    </div>
  );
}
