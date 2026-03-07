import { redirect } from "next/navigation";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export default async function Home() {
  // Always redirect to admin - let admin page handle auth/errors
  redirect("/admin");
}
