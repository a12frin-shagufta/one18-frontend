import React from "react";

const DeliveryOptions = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* HEADING */}
        <h2 className="text-3xl md:text-5xl font-serif font-semibold text-[#1E3A2F] mb-4">
          Delivery and Pick Up Options
        </h2>

        <p className="max-w-3xl mx-auto text-gray-700 mb-14">
          We make it easy for you to get our best, wherever you are. Choose the
          option that suits you best.
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* CARD 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#FBE7B9] p-8 rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec"
                alt="Option One"
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
            <p className="mt-5 text-lg font-medium text-[#1E3A2F]">
              Nationwide Shipping
            </p>
          </div>

          {/* CARD 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#CFE8F3] p-8 rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
                alt="Option Two"
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
            <p className="mt-5 text-lg font-medium text-[#1E3A2F]">
              Advance Orders for Local Pick Up
            </p>
          </div>

          {/* CARD 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#EAD6F4] p-8 rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1542826438-8b7d9c6c8f5b"
                alt="Option Three"
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
            <p className="mt-5 text-lg font-medium text-[#1E3A2F]">
              Catering & Events
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DeliveryOptions;
