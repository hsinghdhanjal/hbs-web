import { redirect } from "next/navigation";
import ProfileSettingsClient from "@/components/admin/ProfileSettingsClient";
import { getCurrentUser } from "@/lib/auth";
import { getSettingsRow } from "@/lib/settings";

export const metadata = {
  title: "Edit Profile | Harsimran Architects & Builders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let settings = null;
  let loadError = "";
  try {
    settings = await getSettingsRow();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load profile settings.";
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
      <ProfileSettingsClient initialSettings={settings} />
    </>
  );
}
