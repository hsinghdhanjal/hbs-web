import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { getContact } from "@/lib/settings";

export default async function SiteLayout({ children }) {
  const contact = await getContact();

  return (
    <>
      <Navbar contact={contact} />
      {children}
      <Footer contact={contact} />
      <FloatingActions contact={contact} />
    </>
  );
}
