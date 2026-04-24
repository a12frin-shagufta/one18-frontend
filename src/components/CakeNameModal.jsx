import { useState } from "react";

const CakeNameModal = ({ open, onClose, onSave, itemName }) => {
  const [cakeName, setCakeName] = useState("");

  if (!open) return null;

  const handleContinue = () => {
    onSave(cakeName.trim());
    setCakeName("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        <div className="text-3xl mb-3">🎂</div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Personalise your cake
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Would you like a name on your <span className="font-medium text-gray-700">{itemName}</span>? This is optional.
        </p>

        <input
          type="text"
          placeholder="e.g. Happy Birthday Sarah!"
          value={cakeName}
          onChange={(e) => setCakeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={handleContinue}
            className="flex-1 bg-[#334b8f] text-white py-3 rounded-lg font-medium text-sm"
          >
            {cakeName.trim() ? "Add to cart" : "Continue anyway"}
          </button>
          <button
            onClick={() => { setCakeName(""); onClose(); }}
            className="px-5 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium text-sm"
          >
            Cancel
          </button>
        </div>

        {/* <p className="text-xs text-gray-400 mt-3 text-center">
          You can also add special instructions at checkout
        </p> */}
      </div>
    </div>
  );
};

export default CakeNameModal;