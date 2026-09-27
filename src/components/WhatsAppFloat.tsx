import { FaWhatsapp } from "react-icons/fa";
import { whatsappUrl } from "@/config/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(
        "Hi, I found InfyCrest Solutions and I'd like to discuss a project.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-10px_rgb(37_211_102/0.8)] transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
    >
      <FaWhatsapp className="size-6" aria-hidden="true" />
    </a>
  );
}
