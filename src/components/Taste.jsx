import React from "react";
import { ArrowRight, MapPin, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const TasteTheMagicSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle pattern/texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#163aa9] rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Content container */}
        <div className="flex flex-col items-center text-center">
          
          {/* "Taste the Magic" text in small border-like button */}
          <div className="mb-4">
            <div className="inline-block px-6 py-3 border-2 border-gray-200 rounded-full">
              <span className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-[#163aa9] bg-clip-text text-transparent">
                Taste the Magic
              </span>
            </div>
          </div>

          {/* Main heading with decorative line */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mr-6" />
              <h1 className="text-6xl md:text-7xl font-serif text-[#163aa9] tracking-tight">
                TASTE THE MAGIC
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 ml-6" />
            </div>
            
            <div className="mt-8 relative">
              <h2 className="text-4xl md:text-5xl font-light text-gray-800">
                Ready to Taste
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#163aa9] via-orange-300 to-[#173dad] bg-clip-text text-transparent mt-2">
                Excellence?
              </h2>
              
              {/* Glow effect for Excellence text */}
              <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-orange-500 to-blue-500 blur-lg opacity-20 rounded-lg" />
            </div>
          </div>

          {/* Description paragraph */}
          <div className="max-w-2xl mb-16">
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of happy customers and experience the finest artisan pastries in Singapore. 
              Baked fresh daily, just for you.
            </p>
          </div>

          {/* Buttons container */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            {/* Place Order Button */}
            <Link to="/order">
            <button className="group relative px-10 py-4 bg-[#163aa9] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden">
              {/* Orange fill on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span>Place an Order</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
              
              {/* Yellow glow */}
              <div className="absolute -inset-1 bg-yellow-400/30 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </button>
            </Link>

            {/* Find Location Button */}
            <Link to="/find-us">
            <button className="group relative px-10 py-4 border-2 border-[#163aa9] text-[#163aa9] rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden">
              {/* Orange fill on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span className="text-[#163aa9] group-hover:text-white transition-colors duration-300">Find a Location</span>
              </div>
              
              {/* Yellow glow */}
              <div className="absolute -inset-1 bg-yellow-400/30 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="mt-20 flex items-center gap-8">
            {/* Star ratings */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-orange-300 text-2xl">★</div>
              ))}
              <span className="text-gray-700 ml-2 text-sm">4.9/5 Rating</span>
            </div>
            
            {/* Separator */}
            <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-400" />
            
            {/* Customer count */}
            <div className="text-gray-700">
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent font-bold">10,000+</span> 
              <span className="ml-2">Happy Customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating pastry elements with gradient */}
      <div className="absolute bottom-10 right-10 opacity-20">
        <div className="text-6xl bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">🥐</div>
      </div>
      <div className="absolute top-10 left-10 opacity-20">
        <div className="text-6xl bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">🥖</div>
      </div>
    </section>
  );
};

export default TasteTheMagicSection;