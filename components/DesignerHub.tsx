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
  {
    id: 'email-responder',
    label: 'Email Responder',
    labelAr: 'الرد على البريد الإلكتروني',
    url: 'https://claude.ai/project/019db18b-9912-721a-8ade-8fe48c0a65a5',
    icon: '✉',
    accent: '#E30613',
  },
  {
    id: 'quotation-tracker',
    label: 'Quotation Database Tracker',
    labelAr: 'متتبع قاعدة عروض الأسعار',
    url: 'https://claude.ai/project/019d8f74-aa70-766b-a2b0-3352a3858ab8',
    icon: '$',
    accent: '#2a2a2a',
  },
];

const HIKVISION_LINKS: DesignerLink[] = [
  {
    id: 'hik-bandwidth',
    label: 'Bandwidth & Storage Calculator',
    labelAr: 'حاسبة النطاق والتخزين',
    url: 'https://hitools.hikvision.com/HiToolsDesigner/#/toolBox?site=en',
    icon: '∑',
    accent: '#E30613',
  },
  {
    id: 'hik-videowall',
    label: 'Video Wall Designer',
    labelAr: 'مصمم جدار الفيديو',
    url: 'https://hitools.hikvision.com/HiToolsDesigner/#/composeSelection/led?site=en',
    icon: '▦',
    accent: '#2a2a2a',
  },
  {
    id: 'hik-hikcentral',
    label: 'HIKCENTRAL Module',
    labelAr: 'وحدة HIKCENTRAL',
    url: 'https://hitools.hikvision.com/HiToolsDesigner/#/composeSelection/hcp?site=en',
    icon: '⬢',
    accent: '#E30613',
  },
];

const OMADA_LINKS: DesignerLink[] = [
  {
    id: 'omada-design',
    label: 'OMADA Project Designer',
    labelAr: 'مصمم مشاريع أومادا',
    url: 'https://aps1-design.tplinkcloud.com/#/projectList',
    icon: '☁',
    accent: '#0093DD',
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
  typeLabel,
  typeLabelAr,
}: {
  link: DesignerLink;
  isAr: boolean;
  t: (en: string, ar: string) => string;
  typeLabel: string;
  typeLabelAr: string;
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
            {t(typeLabel, typeLabelAr)}
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
  const [folder, setFolder] = useState<'root' | 'claude' | 'hikvision' | 'omada'>('root');
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
              'AI-powered design projects for DSPPA, CCTV, Access Control, email responses and quotation tracking.',
              'مشاريع تصميم مدعومة بالذكاء الاصطناعي لـ DSPPA والكاميرات والتحكم بالدخول والرد على البريد ومتتبع عروض الأسعار.',
            )}
            badge={t('FOLDER', 'مجلد')}
            count={t(`${CLAUDE_LINKS.length} projects`, `${CLAUDE_LINKS.length} مشاريع`)}
            onClick={() => setFolder('claude')}
            accent="#E30613"
          />
          <FolderCard
            title={t('HIKVISION Designer', 'مصمم HIKVISION')}
            subtitle={t(
              'HIKVISION design tools: bandwidth & storage, video wall, HIKCENTRAL.',
              'أدوات تصميم HIKVISION: النطاق والتخزين، جدار الفيديو، HIKCENTRAL.',
            )}
            badge={t('FOLDER', 'مجلد')}
            count={t(`${HIKVISION_LINKS.length} tools`, `${HIKVISION_LINKS.length} أدوات`)}
            onClick={() => setFolder('hikvision')}
            accent="#2a2a2a"
          />
          <FolderCard
            title={t('OMADA (TP-LINK) Designer', 'مصمم أومادا (تي بي-لينك)')}
            subtitle={t(
              'TP-Link Omada cloud-based network project designer.',
              'مصمم مشاريع شبكات أومادا السحابي من تي بي-لينك.',
            )}
            badge={t('FOLDER', 'مجلد')}
            count={t(`${OMADA_LINKS.length} tools`, `${OMADA_LINKS.length} أدوات`)}
            onClick={() => setFolder('omada')}
            accent="#0093DD"
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
            <LinkRow
              key={link.id}
              link={link}
              isAr={isAr}
              t={t}
              typeLabel="CLAUDE PROJECT"
              typeLabelAr="مشروع كلود"
            />
          ))}
        </div>
      </div>
    );
  }

  if (folder === 'hikvision') {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          {HIKVISION_LINKS.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              isAr={isAr}
              t={t}
              typeLabel="HIKVISION TOOL"
              typeLabelAr="أداة HIKVISION"
            />
          ))}
        </div>
      </div>
    );
  }

  // omada
  return (
    <div style={{ padding: '12px 0 24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {backBtn}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.55,
          }}>
            {t('FOLDER · OMADA (TP-LINK) DESIGNER', 'مجلد · مصمم أومادا (تي بي-لينك)')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
            {t('OMADA (TP-LINK) Designer', 'مصمم أومادا (تي بي-لينك)')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
        {OMADA_LINKS.map((link) => (
          <LinkRow
            key={link.id}
            link={link}
            isAr={isAr}
            t={t}
            typeLabel="OMADA TOOL"
            typeLabelAr="أداة أومادا"
          />
        ))}
      </div>
    </div>
  );
}
