import { redirect } from "next/navigation";
import ReviewsDashboardClient from "@/components/admin/ReviewsDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { listReviews } from "@/lib/reviews";

export const metadata = {
  title: "Reviews | Harsimran Architects & Builders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let reviews = [];
  let loadError = "";
  try {
    reviews = await listReviews();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load reviews.";
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
      <ReviewsDashboardClient initialReviews={reviews} />
    </>
  );
}
