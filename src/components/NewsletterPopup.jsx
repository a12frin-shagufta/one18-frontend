import { useEffect, useState } from "react";
import axios from "axios";

export default function NewsletterPopup() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ show after delay — only once
  useEffect(() => {
    const seen = localStorage.getItem("newsletter_popup_seen");
    if (seen) return;

    const t = setTimeout(() => setShow(true), 1000); // 18 sec
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem("newsletter_popup_seen", "1");
  };

  const subscribe = async () => {
    if (!email) return alert("Enter email");

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/api/newsletter/subscribe`,
        { email }
      );

      alert(res.data.message || "Subscribed!");
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* CARD */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[fadeIn_.3s_ease]">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
        >
          ✕
        </button>

        {/* IMAGE */}
        <img
          src="/images/desklogo.png" // 🔥 put your logo in /public/logo.png
          className="w-28 mx-auto mb-4"
          alt="launch"
        />

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-center mb-3">
          HEY YOU!
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Get festival launches & special bakery offers first.
        </p>

        {/* INPUT */}
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
        />

        {/* BUTTON */}
        <button
          onClick={subscribe}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : "Keep me updated"}
        </button>

        {/* FOOTER */}
        <button
          onClick={close}
          className="block mx-auto mt-4 text-gray-500 text-sm hover:underline"
        >
          Not interested
        </button>
      </div>
    </div>
  );
}
