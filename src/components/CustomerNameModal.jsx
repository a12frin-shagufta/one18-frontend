import { useState } from "react";

const CustomerNameModal = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          👋 Who’s this order for?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-5">
          We’ll use your name for order updates and a smoother checkout.
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (name.trim()) {
                onSave(name);
              } else {
                onSave(""); // allow empty
              }
            }}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium"
          >
            Continue
          </button>

          <button
            onClick={() => {
              onSave(""); // skip
            }}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
          >
            Skip
          </button>
        </div>

        {/* Small note */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          You can always add your name later at checkout
        </p>
      </div>
    </div>
  );
};

export default CustomerNameModal;