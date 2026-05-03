'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/profile';

type Props = {
  t: (en: string, ar: string) => string;
};

type GenerateResult = {
  entry: Record<string, unknown>;
  authUsers: string;
  replaced: boolean;
};

export default function AdminHub({ t }: Props) {
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [copied, setCopied] = useState<'entry' | 'env' | null>(null);

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoadError(data?.error ?? `HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      setUsers(data.users ?? []);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load users');
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          displayName: displayName.trim() || undefined,
          role: role.trim() || undefined,
          isAdmin,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error ?? `HTTP ${res.status}`);
        return;
      }
      setResult(data);
      setPassword('');
      // Refresh the list so a known username shows the warning correctly
      // next time, even though the env hasn't been updated yet.
      loadUsers();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function copy(value: string, which: 'entry' | 'env') {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Ignore clipboard errors — the textarea allows manual copy.
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid #2a2a2a',
    background: '#fff',
    padding: '8px 10px',
    fontSize: 13,
    fontFamily: 'inherit',
    borderRadius: 3,
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    opacity: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ padding: '12px 0 24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.55,
          marginBottom: 4,
        }}>
          {t('ADMIN', 'الإدارة')}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          {t('User Profiles', 'ملفات المستخدمين')}
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          {t(
            'Add or update sign-in profiles. The server hashes the password and returns a JSON snippet. Paste it into the AUTH_USERS environment variable on Vercel and redeploy for the change to take effect.',
            'إضافة أو تحديث ملفات تسجيل الدخول. يقوم الخادم بتجزئة كلمة المرور ويعيد مقتطف JSON. الصق المقتطف في متغير البيئة AUTH_USERS على Vercel وأعد النشر ليصبح التغيير ساريًا.',
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Existing users */}
        <div style={{
          flex: '1 1 320px', minWidth: 320, maxWidth: 460,
          border: '2px solid #2a2a2a', background: '#fff',
          borderRadius: 4, boxShadow: '4px 4px 0 #2a2a2a',
          padding: '18px 20px',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.6,
            marginBottom: 12,
          }}>
            {t('CONFIGURED USERS', 'المستخدمون المُعدَّون')}
          </div>
          {loadError && (
            <div style={{ fontSize: 12, color: '#E30613', marginBottom: 8 }}>
              {loadError}
            </div>
          )}
          {users === null && !loadError && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{t('Loading…', 'جارٍ التحميل…')}</div>
          )}
          {users && users.length === 0 && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {t('No users yet.', 'لا يوجد مستخدمون.')}
            </div>
          )}
          {users && users.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map((u) => (
                <div key={u.username} style={{
                  border: '1.5px dashed #2a2a2a',
                  borderRadius: 3,
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    border: '2px solid #2a2a2a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fafaf7', fontWeight: 800, fontSize: 11, flexShrink: 0,
                  }}>{u.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.displayName}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.6, fontFamily: 'monospace' }}>
                      @{u.username} · {u.role}
                    </div>
                  </div>
                  {u.isAdmin && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 1,
                      background: '#E30613', color: '#fff',
                      padding: '2px 6px', borderRadius: 2,
                    }}>{t('ADMIN', 'مدير')}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add / update form */}
        <form onSubmit={onSubmit} style={{
          flex: '1 1 360px', minWidth: 320, maxWidth: 520,
          border: '2px solid #2a2a2a', background: '#fff',
          borderRadius: 4, boxShadow: '4px 4px 0 #E30613',
          padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.6,
          }}>
            {t('ADD OR UPDATE USER', 'إضافة أو تحديث مستخدم')}
          </div>

          <div>
            <label style={labelStyle}>{t('Username', 'اسم المستخدم')}</label>
            <input
              style={fieldStyle}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              maxLength={64}
              placeholder="e.g. yahya"
            />
          </div>

          <div>
            <label style={labelStyle}>{t('Password (min 12 chars)', 'كلمة المرور (12 حرفًا على الأقل)')}</label>
            <input
              style={fieldStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={1024}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('Display name', 'الاسم الظاهر')}</label>
            <input
              style={fieldStyle}
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              placeholder="Yahya Khaled"
            />
          </div>

          <div>
            <label style={labelStyle}>{t('Role', 'الدور')}</label>
            <input
              style={fieldStyle}
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              maxLength={80}
              placeholder="Senior Presales"
            />
          </div>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            {t('Grant admin access', 'منح صلاحيات الإدارة')}
          </label>

          {submitError && (
            <div style={{ fontSize: 12, color: '#E30613' }}>{submitError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              border: '2px solid #2a2a2a',
              background: submitting ? '#f4f1ea' : '#2a2a2a',
              color: submitting ? '#2a2a2a' : '#fff',
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
              cursor: submitting ? 'wait' : 'pointer',
              borderRadius: 3,
              boxShadow: '3px 3px 0 #E30613',
              fontFamily: 'inherit',
              alignSelf: 'flex-start',
            }}
          >
            {submitting
              ? t('GENERATING…', 'جارٍ الإنشاء…')
              : t('GENERATE ENTRY', 'إنشاء المُدخل')}
          </button>

          {result && (
            <div style={{
              borderTop: '1.5px dashed #2a2a2a',
              paddingTop: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                {result.replaced
                  ? t('Profile updated for existing username.', 'تم تحديث الملف لاسم المستخدم الحالي.')
                  : t('New profile generated.', 'تم إنشاء ملف جديد.')}
              </div>
              <div style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.5 }}>
                {t(
                  'This is not yet live. Update AUTH_USERS in your Vercel project settings (or .env.local for local dev) and redeploy.',
                  'لم يصبح ساريًا بعد. حدّث AUTH_USERS في إعدادات مشروع Vercel (أو .env.local للتطوير المحلي) وأعد النشر.',
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={labelStyle}>{t('Single entry (JSON)', 'مُدخل واحد (JSON)')}</label>
                  <button
                    type="button"
                    onClick={() => copy(JSON.stringify(result.entry), 'entry')}
                    style={{
                      border: '1.5px solid #2a2a2a',
                      background: '#fff',
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: 3,
                      fontFamily: 'inherit',
                    }}
                  >{copied === 'entry' ? t('COPIED', 'تم النسخ') : t('COPY', 'نسخ')}</button>
                </div>
                <textarea
                  readOnly
                  value={JSON.stringify(result.entry, null, 2)}
                  rows={6}
                  style={{
                    ...fieldStyle,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={labelStyle}>{t('Full AUTH_USERS value', 'قيمة AUTH_USERS كاملة')}</label>
                  <button
                    type="button"
                    onClick={() => copy(result.authUsers, 'env')}
                    style={{
                      border: '1.5px solid #2a2a2a',
                      background: '#fff',
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: 3,
                      fontFamily: 'inherit',
                    }}
                  >{copied === 'env' ? t('COPIED', 'تم النسخ') : t('COPY', 'نسخ')}</button>
                </div>
                <textarea
                  readOnly
                  value={result.authUsers}
                  rows={4}
                  style={{
                    ...fieldStyle,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
