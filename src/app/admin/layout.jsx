import AdminNav from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-white text-[#1E1E1E]">
      {user && <AdminNav email={user.email ?? "admin"} />}
      {children}
    </div>
  );
}
