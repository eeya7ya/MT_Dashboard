"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { next: string };

export default function SignInForm({ next }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.replace(next || "/");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(
        typeof data?.error === "string"
          ? data.error
          : "Sign-in failed. Please try again.",
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      autoComplete="on"
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        border: "2px solid #2a2a2a",
        borderRadius: 6,
        boxShadow: "6px 6px 0 #E30613",
        padding: "28px 28px 24px",
        fontFamily:
          '"Kalam", "Patrick Hand", "Comic Sans MS", cursive',
        color: "#2a2a2a",
        transform: "rotate(-.25deg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            border: "2px solid #2a2a2a",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18,
            transform: "rotate(-2deg)",
            flexShrink: 0,
          }}
        >
          M<span style={{ color: "#E30613" }}>T</span>
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>
            MAGIC TECH
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>
            Presales Hub · sign in
          </div>
        </div>
      </div>

      <h1
        style={{
          margin: "0 0 4px",
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 0.3,
        }}
      >
        Welcome back.
      </h1>
      <p style={{ margin: "0 0 22px", fontSize: 12, opacity: 0.65 }}>
        Sign in with your Magic Tech account to access the hub.
      </p>

      <Field
        id="username"
        label="Username"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        autoFocus
        required
        maxLength={128}
      />

      <Field
        id="password"
        label="Password"
        type={showPw ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        required
        maxLength={1024}
        rightAdornment={
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-pressed={showPw}
            aria-label={showPw ? "Hide password" : "Show password"}
            style={{
              height: 28,
              padding: "0 10px",
              border: "2px solid #2a2a2a",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 3,
              lineHeight: 1,
            }}
          >
            {showPw ? "hide" : "show"}
          </button>
        }
      />

      {error && (
        <div
          role="alert"
          style={{
            border: "2px dashed #E30613",
            background: "#fff5f5",
            color: "#7a0a12",
            padding: "8px 10px",
            fontSize: 12,
            marginBottom: 14,
            borderRadius: 3,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          height: 44,
          border: "2px solid #2a2a2a",
          background: submitting ? "#b3050f" : "#E30613",
          color: "#fff",
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 1,
          cursor: submitting ? "wait" : "pointer",
          borderRadius: 3,
          boxShadow: "3px 3px 0 #2a2a2a",
          transition: "transform .1s",
        }}
      >
        {submitting ? "Signing in…" : "Sign in →"}
      </button>

      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: "1.5px dashed #2a2a2a",
          fontSize: 10,
          opacity: 0.6,
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Internal use · Magic Tech Presales Hub
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
  maxLength?: number;
  rightAdornment?: React.ReactNode;
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  autoFocus,
  required,
  maxLength,
  rightAdornment,
}: FieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.2,
          marginBottom: 4,
          opacity: 0.75,
        }}
      >
        {label.toUpperCase()}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          maxLength={maxLength}
          spellCheck={false}
          style={{
            width: "100%",
            height: 40,
            border: "2px solid #2a2a2a",
            background: "#fafaf7",
            fontFamily: "inherit",
            fontSize: 14,
            padding: `0 ${rightAdornment ? 64 : 10}px 0 10px`,
            borderRadius: 3,
            color: "#2a2a2a",
            outline: "none",
          }}
        />
        {rightAdornment && (
          <div
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {rightAdornment}
          </div>
        )}
      </div>
    </div>
  );
}
