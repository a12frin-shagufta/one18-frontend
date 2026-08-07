import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated Counter Hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

// ── Stat Item ──────────────────────────────────────────────────────────────
function StatItem({ target, suffix = "", label, decimals = 0, started }) {
  const count = useCountUp(target, 2000, started);
  const display = decimals > 0
    ? (count / Math.pow(10, decimals)).toFixed(1)
    : count.toLocaleString();

  return (
    <div className="flex flex-col items-center">
      <p className="text-blue-900 text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums">
        {display}{suffix}
      </p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [animStarted, setAnimStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ✅ MOVING OFFER BAR */}
      <div className="w-full bg-gray-200 text-black py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-8 text-sm font-semibold tracking-wide">
              <span>🥐 Fresh baked daily</span>
              <span>·</span>
              <span>✅ 100% Halal Certified</span>
              <span>·</span>
              <span>⭐ 4.9 Rating on Google</span>
            </span>
          ))}
        </div>
      </div>

      <section className="w-full bg-gradient-to-r from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-[#1E3A8A] text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 tracking-wide text-center leading-snug">
              SINGAPORE'S FINEST · 100% Muslim Owned · Halal Artisanal Bakery
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-blue-900 leading-tight">
              Singapore's <br />
              Finest Artisanal <br />
              Bakery
            </h1>
            <p className="mt-6 text-gray-600 max-w-xl text-lg">
              Where <span className="italic text-[#1E3A8A]">European mastery</span>{" "}
              meets <span className="italic text-[#1E3A8A]">Asian flavors</span>.
              Every pastry is a work of art, baked fresh throughout the day
              using only the finest imported ingredients.
            </p>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate("/menu")}
                className="px-7 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold shadow hover:scale-105 transition"
              >
                Explore Menu
              </button>
              <button
                onClick={() => navigate("/find-us")}
                className="px-7 py-3 border border-blue-800 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Find Us
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-3">
              <video
                autoPlay muted loop playsInline preload="auto"
                poster="/images/hero-fallback.jpg"
                className="w-full h-[420px] object-cover rounded-2xl"
              >
                <source
                  src="https://res.cloudinary.com/dbbvqqbz1/video/upload/f_auto,q_auto/v1770190891/IMG_6242_1_fb3swp.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>

        {/* ── ANIMATED STATS BOX ── */}
        <div
          ref={statsRef}
          className="max-w-5xl mx-auto mt-6 bg-white shadow-xl rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 text-center gap-6"
        >
          {/* 50K+ — animate 0→50, display as "50K+" */}
          <StatItem target={50} suffix="K+" label="Happy Customers" started={animStarted} />
          <StatItem target={100} suffix="+" label="Daily Items" started={animStarted} />
          {/* 4.9 — animate as integer 49 then display as 4.9 */}
          <StatItem target={49} suffix="★" label="Google Rating" decimals={1} started={animStarted} />
          <StatItem target={3} suffix="" label="Locations" started={animStarted} />
        </div>
      </section>
    </>
  );
};

export default Hero;