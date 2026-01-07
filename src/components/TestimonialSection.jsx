import React, { useState, useEffect, useRef } from "react";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sarah L.",
      role: "Regular Customer",
      text: "The pistachio supreme croissant is absolutely divine! I come here every weekend without fail.",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    {
      name: "Ahmad R.",
      role: "Event Organizer",
      text: "One18 catered our corporate event and everyone was blown away. Professional service and amazing pastries!",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Michelle T.",
      role: "Food Blogger",
      text: "Authentic French techniques with local flavors. One18 is a hidden gem in Singapore's bakery scene.",
      avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "James K.",
      role: "Coffee Enthusiast",
      text: "The sourdough is world-class. You can taste the passion and quality ingredients in every bite.",
      avatar: "https://i.pravatar.cc/100?img=23",
    },
    {
      name: "Lisa M.",
      role: "Local Resident",
      text: "Their sourdough bread has become a staple in our home. Fresh, crusty, and absolutely delicious!",
      avatar: "https://i.pravatar.cc/100?img=41",
    },
    {
      name: "David W.",
      role: "Pastry Chef",
      text: "As a professional chef, I appreciate the attention to detail. One18's pastries are truly exceptional.",
      avatar: "https://i.pravatar.cc/100?img=19",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Handle responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, visibleCards]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleCards >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - visibleCards : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calculate visible testimonials
  const getVisibleTestimonials = () => {
    const endIndex = currentIndex + visibleCards;
    if (endIndex <= testimonials.length) {
      return testimonials.slice(currentIndex, endIndex);
    } else {
      return [
        ...testimonials.slice(currentIndex),
        ...testimonials.slice(0, endIndex - testimonials.length),
      ];
    }
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-20  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-gray-500">
            Real stories from people who love One18
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Testimonials Slider */}
          <div
            ref={sliderRef}
            className="overflow-hidden px-2"
          >
            <div
              className="flex transition-transform duration-500 ease-in-out gap-8"
              style={{
                transform: `translateX(calc(${(-currentIndex * 100) / visibleCards}% - ${currentIndex * 2}rem))`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
                  style={{
                    minWidth: `calc(${100 / visibleCards}% - 2rem)`,
                  }}
                >
                  <div className="bg-gray-100 rounded-3xl p-8  relative h-full hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                    {/* Quote Icon */}
                    <div className="text-orange-400 text-6xl leading-none mb-4">
                      "
                    </div>

                    {/* Text */}
                    <p className="text-[#163aa9] text-lg leading-relaxed italic">
                      "{t.text}"
                    </p>

                    {/* Divider */}
                    <div className="my-6 h-px bg-gray-200"></div>

                    {/* User */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-orange-400"
                        />
                        {/* Rating badge */}
                        <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          ★ 5.0
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-sm tracking-wide text-orange-500 uppercase">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center mt-12 space-x-3">
          {Array.from({
            length: Math.ceil(testimonials.length / visibleCards),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * visibleCards)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / visibleCards) === index
                  ? "bg-orange-500 w-8"
                  : "bg-gray-300 hover:bg-orange-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        {/* <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300"
          >
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
                isAutoPlaying ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-300 ${
                  isAutoPlaying ? "translate-x-4" : ""
                }`}
              />
            </div>
            <span className="text-sm font-medium">
              {isAutoPlaying ? "Auto-play ON" : "Auto-play OFF"}
            </span>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialSection;