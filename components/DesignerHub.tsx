'use client';

import { useState } from 'react';

type Props = {
  t: (en: string, ar: string) => string;
};

type DesignerLink = {
  id: string;
  label: string;
  labelAr: string;
  url: string;
  icon: string;
  accent: string;
};

const CLAUDE_LINKS: DesignerLink[] = [
  {
    id: 'dsppa',
    label: 'DSPPA Designer',
    labelAr: 'مصمم DSPPA',
    url: 'https://claude.ai/project/019d8699-5139-72e2-a63f-ffc28e999955',
    icon: '♪',
    accent: '#E30613',
  },
  {
    id: 'cctv',
    label: 'CCTV Designer',
    labelAr: 'مصمم كاميرات المراقبة',
    url: 'https://claude.ai/project/019da6a6-5391-74d4-8538-2c5244d97921',
    icon: '⊙',
    accent: '#2a2a2a',
  },
  {
    id: 'access',
    label: 'Access Designer',
    labelAr: 'مصمم التحكم بالدخول',
    url: 'https://claude.ai/project/019da5ce-25d1-7107-a85a-a915580eb190',
    icon: '⌨',
    accent: '#2a2a2a',
  },
];

function FolderCard({
  title,
  subtitle,
  badge,
  count,
  onClick,
  disabled,
  accent,
}: {
  title: string;
  subtitle: string;
  badge: string;
  count: string;
  onClick?: () => void;
  disabled?: boolean;
  accent: string;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: 320,
        position: 'relative',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transform: 'rotate(-.3deg)',
      }}
    >
      {/* Folder tab */}
      <div style={{
        position: 'absolute',
        top: -14,
        left: 22,
        border: '2px solid #2a2a2a',
        borderBottom: 'none',
        background: accent,
        color: '#fff',
        padding: '4px 16px 6px',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 1.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      }}>
        {badge}
      </div>

      {/* Folder body */}
      <div style={{
        border: '2px solid #2a2a2a',
        background: '#fff',
        borderRadius: 4,
        padding: '26px 22px 20px',
        boxShadow: '6px 6px 0 #2a2a2a',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 52, height: 52,
            border: '2px solid #2a2a2a',
            background: accent,
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800,
            transform: 'rotate(-3deg)',
            boxShadow: '2px 2px 0 #2a2a2a',
            flexShrink: 0,
          }}>📁</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4, lineHeight: 1.4 }}>{subtitle}</div>
          </div>
        </div>

        <div style={{
          borderTop: '1.5px dashed #2a2a2a',
          paddingTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 10,
            fontFamily: 'monospace',
            opacity: 0.6,
            letterSpacing: 0.5,
          }}>{count}</span>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: disabled ? '#888' : '#E30613',
            letterSpacing: 0.5,
          }}>
            {disabled ? '◴' : 'OPEN ↗'}
          </span>
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  link,
  isAr,
  t,
}: {
  link: DesignerLink;
  isAr: boolean;
  t: (en: string, ar: string) => string;
}) {
  return (
    <a href={link.url} target="_blank" rel="noreferrer"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        border: '2px solid #2a2a2a',
        background: '#fff',
        borderRadius: 4,
        padding: '14px 16px',
        boxShadow: '4px 4px 0 #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        transform: 'rotate(-.15deg)',
      }}>
        <div style={{
          width: 44, height: 44,
          border: '2px solid #2a2a2a',
          background: link.accent,
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 800,
          flexShrink: 0,
        }}>{link.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: '#E30613', fontWeight: 800, letterSpacing: 1.5 }}>
            {t('CLAUDE PROJECT', 'مشروع كلود')}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>
            {isAr ? link.labelAr : link.label}
          </div>
          <div style={{
            fontSize: 10,
            fontFamily: 'monospace',
            opacity: 0.5,
            marginTop: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{link.url.replace('https://', '')}</div>
        </div>
        <div style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#E30613',
          letterSpacing: 0.5,
          flexShrink: 0,
        }}>{t('OPEN ↗', 'فتح ↗')}</div>
      </div>
    </a>
  );
}

export default function DesignerHub({ t }: Props) {
  const [folder, setFolder] = useState<'root' | 'claude' | 'hikvision'>('root');
  const isAr = t('x', 'y') === 'y';

  if (folder === 'root') {
    return (
      <div style={{ padding: '12px 0 24px', height: '100%', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.55,
            marginBottom: 4,
          }}>
            {t('DESIGNER WORKSPACES', 'مساحات المصمم')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {t('Pick a designer folder', 'اختر مجلد المصمم')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', paddingTop: 14 }}>
          <FolderCard
            title={t('Claude Designer', 'مصمم كلود')}
            subtitle={t(
              'AI-powered design projects for DSPPA, CCTV and Access Control systems.',
              'مشاريع تصميم مدعومة بالذكاء الاصطناعي لأنظمة DSPPA والكاميرات والتحكم بالدخول.',
            )}
            badge={t('FOLDER', 'مجلد')}
            count={t(`${CLAUDE_LINKS.length} projects`, `${CLAUDE_LINKS.length} مشاريع`)}
            onClick={() => setFolder('claude')}
            accent="#E30613"
          />
          <FolderCard
            title={t('HIKVISION Designer', 'مصمم HIKVISION')}
            subtitle={t(
              'HIKVISION-specific design tools. Configuration coming soon.',
              'أدوات تصميم خاصة بـ HIKVISION. سيتم التهيئة قريبًا.',
            )}
            badge={t('SOON', 'قريبًا')}
            count={t('configured soon', 'قيد التهيئة')}
            onClick={() => setFolder('hikvision')}
            accent="#2a2a2a"
            disabled
          />
        </div>
      </div>
    );
  }

  const backBtn = (
    <button
      onClick={() => setFolder('root')}
      style={{
        border: '2px solid #2a2a2a',
        background: '#fff',
        padding: '6px 12px',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5,
        cursor: 'pointer',
        borderRadius: 3,
        boxShadow: '2px 2px 0 #2a2a2a',
        fontFamily: 'inherit',
      }}>
      {t('← BACK', '→ رجوع')}
    </button>
  );

  if (folder === 'claude') {
    return (
      <div style={{ padding: '12px 0 24px', height: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          {backBtn}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.55,
            }}>
              {t('FOLDER · CLAUDE DESIGNER', 'مجلد · مصمم كلود')}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
              {t('Claude Designer', 'مصمم كلود')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          {CLAUDE_LINKS.map((link) => (
            <LinkRow key={link.id} link={link} isAr={isAr} t={t} />
          ))}
        </div>
      </div>
    );
  }

  // hikvision
  return (
    <div style={{ padding: '12px 0 24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {backBtn}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.55,
          }}>
            {t('FOLDER · HIKVISION DESIGNER', 'مجلد · مصمم HIKVISION')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
            {t('HIKVISION Designer', 'مصمم HIKVISION')}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 560,
        border: '2px dashed #2a2a2a',
        background: '#fff',
        padding: 28,
        borderRadius: 4,
        textAlign: 'center',
        transform: 'rotate(-.3deg)',
      }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🛠</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
          {t('Configured soon', 'قيد التهيئة قريبًا')}
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
          {t(
            'HIKVISION Designer tools will be added here shortly.',
            'سيتم إضافة أدوات مصمم HIKVISION هنا قريبًا.',
          )}
        </div>
      </div>
    </div>
  );
}
