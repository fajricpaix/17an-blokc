import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminNavMobile } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/login");
  }
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 sm:pb-16">
        {children}
      </main>
      <AdminNavMobile />
    </>
  );
}
