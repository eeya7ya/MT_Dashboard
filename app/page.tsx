import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { fallbackProfile } from "@/lib/profile";
import { dbGetProfile } from "@/lib/users";
import PresalesHub from "@/components/PresalesHub";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  if (!session) redirect("/signin");

  let user;
  try {
    user = (await dbGetProfile(session.sub)) ?? fallbackProfile(session.sub);
  } catch {
    user = fallbackProfile(session.sub);
  }

  return (
    <main className="mt-artboard-wrap">
      <PresalesHub user={user} />
    </main>
  );
}
