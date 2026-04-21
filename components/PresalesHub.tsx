'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import OverviewOrbit from './OverviewOrbit';
import LauncherCard from './LauncherCard';
import ManufacturerBar from './ManufacturerBar';
import DesignerHub from './DesignerHub';

export default function PresalesHub() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [active, setActive] = useState('overview');

  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const apps = [
    {
      id: 'overview',
      icon: '◉',
      label: t('Overview', 'نظرة عامة'),
    },
    {
      id: 'quote',
      icon: '✎',
      label: t('Quotation Designer', 'مصمم العروض'),
      launcher: true,
      url: 'https://magictech-quotation.dev',
    },
    {
      id: 'pricing',
      icon: '$',
      label: t('Pricing Sheets', 'قوائم الأسعار'),
      launcher: true,
      url: 'https://pricing-sheet-six.vercel.app/',
    },
    {
      id: 'designer',
      icon: '📁',
      label: t('Designer', 'المصمم'),
    },
    { id: '_soon1', icon: '＋', label: t('Add app', 'إضافة تطبيق'), soon: true },
  ];

  const activeApp = apps.find((a) => a.id === active);

  return (
    <div
      className="mt-artboard"
      style={{
        background: '#fafaf7',
        fontFamily: '"Kalam", "Patrick Hand", "Comic Sans MS", cursive',
        direction: isAr ? 'rtl' : 'ltr',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        gridTemplateRows: '1fr',
      }}
    >
      {/* Dot-grid paper texture */}
      <svg
        style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none', zIndex: 0 }}
        width={1440} height={900}
      >
        <defs>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".6" fill="#c9c5b8" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#dots)" />
      </svg>

      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Sidebar
          apps={apps}
          active={active}
          setActive={setActive}
          isAr={isAr}
          t={t}
        />
      </div>

      {/* Main column */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: 900, overflow: 'hidden',
      }}>
        <TopBar
          title={activeApp?.label ?? t('Overview', 'نظرة عامة')}
          lang={lang}
          setLang={(l) => setLang(l as 'en' | 'ar')}
          t={t}
        />

        {/* Content area */}
        <div style={{ flex: 1, padding: '24px 24px 0', overflow: 'hidden', minHeight: 0 }}>
          {active === 'overview' && (
            <OverviewOrbit lang={lang} t={t} />
          )}
          {active === 'quote' && (
            <LauncherCard
              title={t('Quotation Designer', 'مصمم العروض')}
              desc={t(
                'Build branded, multi-section quotations across all Magic Tech partner lines — DSPPA, HIKVISION, Legrand, Schneider, KNX, GVS and more. Opens the external Quotation Designer workspace in a new tab.',
                'بناء عروض متعددة الأقسام عبر جميع خطوط العلامات الشريكة — DSPPA وHIKVISION وLegrand وSchneider وKNX وGVS وغيرها. تفتح مساحة عمل مصمم العروض في تبويب جديد.',
              )}
              url="https://magictech-quotation.dev"
              icon="✎"
              t={t}
            />
          )}
          {active === 'pricing' && (
            <LauncherCard
              title={t('Pricing Sheets', 'قوائم الأسعار')}
              desc={t(
                'Live distributor pricing for HIKVISION, DSPPA, Legrand, Schneider, KNX/GVS, Tenda, Extreme, SIB, and TeledataOne — with stock levels, list prices, distributor costs, and margin calculators. Opens the Pricing Sheets portal in a new tab.',
                'أسعار الموزع الحية لـ HIKVISION وDSPPA وLegrand وSchneider وKNX/GVS وTenda وExtreme وSIB وTeledataOne — مع مستويات المخزون وأسعار القوائم وتكاليف الموزع وحاسبات الهامش. تفتح بوابة قوائم الأسعار في تبويب جديد.',
              )}
              url="https://pricing-sheet-six.vercel.app/"
              icon="$"
              t={t}
            />
          )}
          {active === 'designer' && (
            <DesignerHub t={t} />
          )}
        </div>

        <ManufacturerBar t={t} />
      </div>
    </div>
  );
}
