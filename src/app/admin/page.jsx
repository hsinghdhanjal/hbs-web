import { redirect } from "next/navigation";
import EnquiriesDashboardClient from "@/components/admin/EnquiriesDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { listEnquiries } from "@/lib/enquiries";

export const metadata = {
  title: "Enquiry Management | Harsimran Architects & Builders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let enquiries = [];
  let loadError = "";
  try {
    enquiries = await listEnquiries();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load enquiries.";
  }

  return (
    <>
      {loadError && (
        <div className="hab-container pt-6">
          <div className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
            {loadError}
          </div>
        </div>
      )}
      <EnquiriesDashboardClient initialEnquiries={enquiries} adminEmail={user.email ?? "admin"} />
    </>
  );
}
