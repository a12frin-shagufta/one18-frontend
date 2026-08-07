export default function ChatWidget() {
  const whatsappNumber = "91111712";
  const whatsappMessage = encodeURIComponent("Hi! I'd like to know more about your bakery 🎂");
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 active:scale-90 transition-all duration-300 ring-4 ring-white"
        aria-label="Chat with us on WhatsApp"
      >
        {/* WhatsApp Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.67 4.827 1.84 6.84L2 30l7.36-1.8A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 01-5.88-1.6l-.42-.25-4.36 1.06 1.1-4.24-.28-.44A11.56 11.56 0 014.4 16C4.4 9.6 9.6 4.4 16 4.4S27.6 9.6 27.6 16 22.4 27.6 16 27.6zm6.34-8.6c-.35-.18-2.06-1.02-2.38-1.13-.32-.12-.55-.18-.78.18s-.9 1.13-1.1 1.36c-.2.23-.4.26-.74.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.74-2.06-1.94-2.41-.2-.35-.02-.54.15-.71.15-.16.35-.4.52-.6.18-.2.23-.35.35-.58.12-.23.06-.44-.03-.62-.09-.18-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.44-.32.35-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.18.23 2.42 3.7 5.86 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.06-.84 2.35-1.65.29-.82.29-1.52.2-1.66-.08-.15-.3-.23-.65-.4z" />
        </svg>

        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20 pointer-events-none"></span>
      </a>

      {/* Tooltip label */}
      <span className="mt-2 text-xs text-gray-500 font-medium tracking-wide">Chat on WhatsApp</span>

    </div>
  );
}