import { redirect } from "next/navigation";
import ProjectsDashboardClient from "@/components/admin/ProjectsDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { listProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects CMS | Harsimran Architects & Builders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let projects = [];
  let loadError = "";
  try {
    projects = await listProjects();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load projects.";
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
      <ProjectsDashboardClient initialProjects={projects} />
    </>
  );
}
