import React, { useState, useEffect, useRef } from "react";

const TestimonialSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const testimonials = [
    {
      name: "Di Di",
      // role: "Food: 5/5  |  Service: 5/5  |  Atmosphere: 5/5",
      text: "I love the quiche. It was cooked to perfection, with a little runny interior and well cooked exterior. The flavours were just right and the best part is, the staff that packed the food was hospitable. It is the warmness that service crews provide that brings customers back to a store.",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocINqiGLTNwzpLATUMYSd6Xqe-x7dmcespvlf6NpThmbpMpOnQ=w130-h130-p-rp-mo-ba6-br100",
    },
    {
      name: "Ezdiyan Lukman",
      // role: "Event Organizer",
      text: "Enquired about Hari Raya Cookies to order for Staff and he was very patient with us! One18 Bakery has also came over to my school a few times for Bake Sale!",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjU8bMYO1N1n1Ha-ufsaSwFer7zWG80l_VzdYYfbnyifEWLoQn7LaQ=w130-h130-p-rp-mo-ba6-br100",
    },
    {
      name: "Wayne Huang",
      // role: "Food Blogger",
      text: "North bridge road branch has buffet menu. Quaint cosy cafe. Good to reserve on their website. They have cheese cakes, sweet and savoury croissants (rendang beef, chicken, ikan billis), quiches. You can ask them to heat up the savoury items. Buffet comes with one coffee (lattes). It’s a good option to taste all their pastries like ala carte high tea. Take your time to order, the buffet is about 2 hours.",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocLe_nRTeuE_zGeLhuvIsp13MehfO38kJQKq438WsW_4oKOBbQ=w130-h130-p-rp-mo-ba3-br100",
    },
    {
      name: "Mei Leng Lee",
      // role: "Coffee Enthusiast",
      text: "North bridge road branch has buffet menu. Quaint cosy cafe. Good to reserve on their website. They have cheese cakes, sweet and savoury croissants (rendang beef, chicken, ikan billis), quiches. You can ask them to heat up the savoury items. Buffet comes with one coffee (lattes). It’s a good option to taste all their pastries like ala carte high tea. Take your time to order, the buffet is about 2 hours.",
      avatar: "https://i.pinimg.com/736x/fe/db/e3/fedbe389b9ba006ebd593e15c5c9efec.jpg",
    },
    {
      name: "Nue Rz",
      // role: "Local Resident",
      text: "We chanced upon the bakery around our new neighbourhood as we just moved to the East and it was lovely to step into a bakery with the owner being so welcoming and sharing their specials even though it was close to closing time. Service was 110% Bought their ondeh-ondeh rolls and they were so fluffy and delicious. We also bought some savoury pastries chicken and beef rendang it was so rich with spices and I kept it the next day to eat up and it was still fresh! Wouldn’t be our last visit for sure.",
      avatar: "https://i.pinimg.com/736x/9e/81/63/9e8163f56572232bfbce1b6530f6de7c.jpg",
    },
  
    {
      name: "farhanah",
      // role: "Pastry Chef",
      text: "Went all the way from Balestier to try these halal Supreme Croissants! They were crunchy on the outside, soft and buttery on the inside. Love the pistachio and rendang filling, so delicious. Would love to try other flavours too. They sell lots of other pastries too. Worth the travel and calories!",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocIlnXXDbUUjuiqzXm2vWNCFrBtIrxb0vqhl4CPimLAuE7qVBg=w130-h130-p-rp-mo-br100",
    },
    {
      name: "Chris Lai",
      role: "self proclaimed foodie",
      text: "Affordable crème brulé and stuffed circular croissants in the hood that did not skimp on the portion size",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV23ri0KYEjYNquHyhtWTE4K-SdovaRb6y0PfFYMnB0ln5fkYVH=w130-h130-p-rp-mo-ba6-br100",
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
                    {/* Text */}
<p className="text-[#163aa9] text-lg leading-relaxed italic">
  "
  {expandedIndex === i
    ? t.text
    : t.text.length > 180
    ? t.text.substring(0, 180) + "..."
    : t.text}
  "
</p>

{/* Read More Button */}
{t.text.length > 180 && (
  <button
    onClick={() =>
      setExpandedIndex(expandedIndex === i ? null : i)
    }
    className="mt-3 text-orange-500 font-semibold text-sm hover:underline transition"
  >
    {expandedIndex === i ? "Read Less" : "Read More"}
  </button>
)}
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