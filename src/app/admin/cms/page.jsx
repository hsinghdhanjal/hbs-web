import { redirect } from "next/navigation";
import CMSDashboardClient from "@/components/cms/CMSDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { listImages } from "@/lib/images";

export const metadata = {
  title: "Site Images CMS | Harsimran Architects & Builders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let images = [];
  let loadError = "";
  try {
    images = await listImages();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load images.";
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
      <CMSDashboardClient initialImages={images} />
    </>
  );
}
