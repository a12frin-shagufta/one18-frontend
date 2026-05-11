// src/components/AddOnModal.jsx
import React, { useState, useMemo } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { formatPrice } from "../utils/currency";
import { toast } from "react-toastify";

const AddOnModal = ({ item, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(item.variants[0]);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [qty, setQty] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");

  // Single-select (radio)
  const handleSingleAddOn = (groupName, option) => {
    setSelectedAddOns((prev) => ({ ...prev, [groupName]: option }));
  };

  // Multi-select (checkbox)
  const handleMultiAddOn = (groupName, option, checked) => {
    setSelectedAddOns((prev) => {
      const existing = prev[groupName] || {};
      if (checked) {
        return { ...prev, [groupName]: { ...existing, [option.label]: option } };
      } else {
        const updated = { ...existing };
        delete updated[option.label];
        return { ...prev, [groupName]: updated };
      }
    });
  };

  // Total add-ons price
  const addOnsTotal = useMemo(() => {
    let total = 0;
    Object.values(selectedAddOns).forEach((val) => {
      if (val && "price" in val) {
        total += Number(val.price) || 0;
      } else if (val && typeof val === "object") {
        Object.values(val).forEach((opt) => {
          total += Number(opt.price) || 0;
        });
      }
    });
    return total;
  }, [selectedAddOns]);

  const basePrice = selectedVariant?.discountedPrice ?? selectedVariant?.price ?? 0;
 const wordingFee =
  cakeMessage.trim() !== "" ? 5 : 0;

const totalPrice =
  (basePrice + addOnsTotal + wordingFee) * qty;

  const handleSubmit = () => {
    // Validate required groups
    const requiredGroups = (item.addOns || []).filter((g) => g.required);
    for (const group of requiredGroups) {
      const picked = selectedAddOns[group.groupName];
      const hasPick =
        picked &&
        ("label" in picked
          ? true
          : Object.keys(picked).length > 0);
      if (!hasPick) {
        toast.error(`Please select an option for "${group.groupName}"`);
        return;
      }
    }

    // Build flat add-ons array
    const chosenAddOns = [];
    Object.entries(selectedAddOns).forEach(([groupName, val]) => {
      if (val && "label" in val) {
        chosenAddOns.push({ groupName, label: val.label, price: Number(val.price) || 0 });
      } else if (val && typeof val === "object") {
        Object.values(val).forEach((opt) => {
          chosenAddOns.push({ groupName, label: opt.label, price: Number(opt.price) || 0 });
        });
      }
    });

onAddToCart({
  variant: selectedVariant,
  addOns: chosenAddOns,
  qty,
  cakeMessage,
  totalPrice: basePrice + addOnsTotal + wordingFee,
});

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal — slides up from bottom on mobile, centered on desktop */}
      <div className="fixed z-50 bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center">
        <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl">

          {/* Header */}
          <div className="flex items-start gap-3 p-4 border-b">
            {item.images?.[0] && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-base leading-tight">
                {item.name}
              </h2>
              <p className="text-sm text-blue-700 font-semibold mt-0.5">
                {formatPrice(basePrice)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition flex-shrink-0"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-4 space-y-4">

            {/* Variants — only show if more than 1 */}
            {item.variants.length > 1 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50">
                  <p className="font-semibold text-gray-900 text-sm">Choose Size</p>
                  <p className="text-xs text-gray-500">Required · Pick one</p>
                </div>
                <div className="divide-y">
                  {item.variants.map((v) => (
                    <label
                      key={v.label}
                      className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{v.label}</p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(v.discountedPrice ?? v.price)}
                        </p>
                      </div>
                      <input
                        type="radio"
                        checked={selectedVariant?.label === v.label}
                        onChange={() => setSelectedVariant(v)}
                        className="w-4 h-4 accent-[#1E3A8A]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add-On Groups */}
            {(item.addOns || []).map((group) => (
              <div key={group.groupName} className="border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{group.groupName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {group.required ? "Required · " : "Optional · "}
                      {group.multiSelect ? "Pick multiple" : "Pick one"}
                    </p>
                  </div>
                  {group.required && (
                    <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>

                <div className="divide-y">
                  {group.options.map((opt) => {
                    const isSelected = group.multiSelect
                      ? !!selectedAddOns[group.groupName]?.[opt.label]
                      : selectedAddOns[group.groupName]?.label === opt.label;

                    return (
                      <label
                        key={opt.label}
                        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                          {opt.price > 0 ? (
                            <p className="text-xs text-gray-500">+{formatPrice(opt.price)}</p>
                          ) : (
                            <p className="text-xs text-green-600">Free</p>
                          )}
                        </div>
                        {group.multiSelect ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleMultiAddOn(group.groupName, opt, e.target.checked)
                            }
                            className="w-4 h-4 accent-[#1E3A8A]"
                          />
                        ) : (
                          <input
                            type="radio"
                            name={group.groupName}
                            checked={isSelected}
                            onChange={() => handleSingleAddOn(group.groupName, opt)}
                            className="w-4 h-4 accent-[#1E3A8A]"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="border rounded-xl overflow-hidden">
  <div className="px-4 py-3 bg-gray-50">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-900 text-sm">
          Cake Wording
        </p>

        <p className="text-xs text-gray-500 mt-0.5">
          Optional custom message on cake
        </p>
      </div>

      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-1 rounded-full">
        +{formatPrice(5)}
      </span>
    </div>
  </div>

  <div className="p-4 space-y-2">
    <input
      type="text"
      maxLength={40}
      placeholder='Example: "Happy Birthday Emma"'
      value={cakeMessage}
      onChange={(e) => setCakeMessage(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
    />

    <div className="flex items-center justify-between">
      <p className="text-xs text-orange-600">
        Custom wording adds +{formatPrice(5)}
      </p>

      <p className="text-xs text-gray-400">
        {cakeMessage.length}/40
      </p>
    </div>
  </div>
</div>
          </div>

          {/* Footer — Add to Cart button */}
          <div className="p-4 border-t bg-white">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#1E3A8A] text-white py-3.5 rounded-xl font-semibold text-base transition active:scale-95"
            >
              Add to Cart — {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOnModal;