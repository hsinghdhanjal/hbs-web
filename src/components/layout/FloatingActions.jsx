import { Phone, MessageCircle } from "lucide-react";
import { CONTACT as CONTACT_DEFAULT } from "@/data/site";

export default function FloatingActions({ contact = CONTACT_DEFAULT }) {
  const CONTACT = contact;
  const waHref = `https://wa.me/${CONTACT.whatsappE164}?text=${encodeURIComponent(
    CONTACT.whatsappMessage
  )}`;
  return (
    <div
      data-testid="floating-actions"
      className="fixed z-40 right-4 md:right-6 bottom-24 md:bottom-8 flex flex-col gap-3"
    >
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        data-testid="floating-whatsapp"
        className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#1E1E1E] text-[#F8F7F4] border border-[#1E1E1E] hover:bg-[#C9A66B] hover:text-[#1E1E1E] hover:border-[#C9A66B] transition-all duration-300 shadow-lg"
      >
        <MessageCircle size={20} strokeWidth={1.5} />
      </a>
      <a
        href={`tel:${CONTACT.phoneE164}`}
        aria-label="Call us"
        data-testid="floating-call"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#F8F7F4] text-[#1E1E1E] border border-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#F8F7F4] transition-all duration-300 shadow-lg"
      >
        <Phone size={20} strokeWidth={1.5} />
      </a>
    </div>
  );
}
