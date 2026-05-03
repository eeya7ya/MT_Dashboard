import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { fallbackProfile, getProfile } from "@/lib/profile";
import PresalesHub from "@/components/PresalesHub";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  if (!session) redirect("/signin");

  const user = getProfile(session.sub) ?? fallbackProfile(session.sub);

  return (
    <main className="mt-artboard-wrap">
      <PresalesHub user={user} />
    </main>
  );
}
