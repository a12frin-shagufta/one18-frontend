import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart drawer
  const [showBranchModal, setShowBranchModal] = useState(false);

  const dropdownRef = useRef(null);
  const { totalItems } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/best-sellers", label: "Best Sellers" },
    // { 
    //   label: "Menu",
    //   submenu: [
    //     { to: "/menu/pastries", label: "Pastries" },
    //     { to: "/menu/breads", label: "Artisan Breads" },
    //     { to: "/menu/cakes", label: "Cakes" },
    //     { to: "/menu/desserts", label: "Desserts" },
    //     { to: "/menu/seasonal", label: "Seasonal Specials" },
    //   ]
    // },
    { to: "/catering", label: "Catering" },
    { to: "/about-us", label: "Our Story" },
    { to: "/find-us", label: "Location" },
  ];

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm  top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* LEFT LOGO */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
              <img
                src="/images/mobilelogo.png"
                alt="Bakery Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1 justify-center">
              <ul className="flex items-center space-x-6 text-sm tracking-widest text-gray-700 uppercase">
                {navItems.map((item) => (
                  <li key={item.label} className="relative">
                    {item.submenu ? (
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center hover:text-black transition-colors duration-200"
                        >
                          {item.label}
                          <svg 
                            className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* DROPDOWN MENU */}
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.to}
                                to={subItem.to}
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.to}
                        className="hover:text-black transition-colors duration-200 relative group"
                      >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* SEARCH ICON */}
              {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button> */}

              {/* CART WITH COUNTER */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Shopping Cart"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4
                         M7 13L5.4 5
                         M7 13l-2.293 2.293
                         c-.63.63-.184 1.707.707 1.707H17
                         m0 0a2 2 0 100 4
                         a2 2 0 000-4
                         zm-8 2a2 2 0 11-4 0
                         a2 2 0 014 0z"
                    />
                  </svg>

                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* ORDER NOW BUTTON */}
              <Link
                to="/order"
                className="hidden md:inline-block px-5 py-2.5 bg-[#334b8f] text-white text-sm uppercase tracking-wider font-semibold hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 transform hover:-translate-y-0.5 rounded-sm"
              >
                Order Now
              </Link>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <div className={`lg:hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-300 ease-in-out`}>
            <div className="px-2 pt-2 pb-4 space-y-1 bg-white shadow-lg rounded-b-lg border-t border-gray-100">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <div className="space-y-1">
                      <div className="px-4 py-3 text-base font-medium text-gray-700 uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.to}
                            to={subItem.to}
                            className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors uppercase tracking-wide"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* MOBILE ORDER BUTTON */}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/order"
                  className="block px-4 py-3 text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm uppercase tracking-wider font-semibold hover:shadow-md transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order Now
                </Link>
              </div>

              {/* CONTACT INFO */}
              {/* <div className="mt-4 px-4 py-3 bg-gray-50 rounded-md">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Call Us</p>
                      <a href="tel:+6588888888" className="text-sm font-semibold text-gray-900 hover:text-amber-700">
                        +65 8888 8888
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Open Hours</p>
                      <p className="text-sm font-semibold text-gray-900">7am - 9pm Daily</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Drawer - RENDERED OUTSIDE THE HEADER */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}