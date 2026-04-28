import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import SignInForm from "./SignInForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in · Magic Tech Presales Hub",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const cookieStore = await cookies();
  const existing = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  const params = await searchParams;
  const next = sanitizeNext(params?.next);

  if (existing) redirect(next);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
        background: "#fafaf7",
      }}
    >
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.28,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="signin-dots"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".6" fill="#c9c5b8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#signin-dots)" />
      </svg>

      <SignInForm next={next} />
    </main>
  );
}

function sanitizeNext(input: string | undefined): string {
  // Only allow same-origin relative paths to prevent open-redirects.
  if (!input || typeof input !== "string") return "/";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  if (input.includes("\\")) return "/";
  return input;
}
