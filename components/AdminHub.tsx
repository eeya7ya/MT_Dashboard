'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/profile';

type Props = {
  t: (en: string, ar: string) => string;
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busyUser, setBusyUser] = useState<string | null>(null);

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data?.error ?? `HTTP ${res.status}`);
        return;
      }
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
    setSuccessMsg(null);
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
      setSuccessMsg(
        data.created
          ? t(`User "${data.profile.username}" created.`, `تم إنشاء المستخدم "${data.profile.username}".`)
          : t(`User "${data.profile.username}" updated.`, `تم تحديث المستخدم "${data.profile.username}".`),
      );
      setUsername('');
      setPassword('');
      setDisplayName('');
      setRole('');
      setIsAdmin(false);
      loadUsers();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(target: Profile) {
    if (busyUser) return;
    const ok = window.confirm(
      t(
        `Delete "${target.displayName}" (@${target.username})? This can't be undone.`,
        `حذف "${target.displayName}" (@${target.username})؟ لا يمكن التراجع.`,
      ),
    );
    if (!ok) return;
    setBusyUser(target.username);
    setSubmitError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: target.username }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error ?? `HTTP ${res.status}`);
        return;
      }
      setSuccessMsg(
        t(`Deleted "${target.username}".`, `تم حذف "${target.username}".`),
      );
      loadUsers();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setBusyUser(null);
    }
  }

  function loadIntoForm(u: Profile) {
    setUsername(u.username);
    setDisplayName(u.displayName);
    setRole(u.role === 'Member' ? '' : u.role);
    setIsAdmin(u.isAdmin);
    setPassword('');
    setSuccessMsg(null);
    setSubmitError(null);
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
            'Add, edit, or remove sign-in profiles. Changes are saved instantly to the database — no redeploy needed.',
            'إضافة أو تعديل أو حذف ملفات تسجيل الدخول. يتم حفظ التغييرات فورًا في قاعدة البيانات — دون الحاجة إلى إعادة النشر.',
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
            {t('USERS', 'المستخدمون')}
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
                  <button
                    type="button"
                    onClick={() => loadIntoForm(u)}
                    title={t('Edit', 'تعديل')}
                    style={{
                      border: '1.5px solid #2a2a2a',
                      background: '#fff',
                      width: 26, height: 26,
                      fontSize: 12, fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: 3,
                      fontFamily: 'inherit',
                      flexShrink: 0,
                    }}
                  >✎</button>
                  <button
                    type="button"
                    disabled={busyUser === u.username}
                    onClick={() => onDelete(u)}
                    title={t('Delete', 'حذف')}
                    style={{
                      border: '1.5px solid #E30613',
                      background: '#fff',
                      color: '#E30613',
                      width: 26, height: 26,
                      fontSize: 12, fontWeight: 800,
                      cursor: busyUser === u.username ? 'wait' : 'pointer',
                      borderRadius: 3,
                      fontFamily: 'inherit',
                      flexShrink: 0,
                    }}
                  >×</button>
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
          <div style={{ fontSize: 11, opacity: 0.65, lineHeight: 1.4 }}>
            {t(
              'Submitting an existing username updates that user (and resets their password to the one you enter).',
              'إرسال اسم مستخدم موجود يقوم بتحديث ذلك المستخدم (ويعيد تعيين كلمة المرور إلى التي أدخلتها).',
            )}
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
          {successMsg && (
            <div style={{ fontSize: 12, color: '#1a7a3a', fontWeight: 700 }}>{successMsg}</div>
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
              ? t('SAVING…', 'جارٍ الحفظ…')
              : t('SAVE USER', 'حفظ المستخدم')}
          </button>
        </form>
      </div>
    </div>
  );
}
