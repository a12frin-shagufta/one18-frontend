// src/components/QuantityAddOnGroup.jsx
//
// Customer-facing picker for a "quantity" add-on group, e.g. the 12pc Mini
// Croissant bundle: pick up to 6 flavours, in pairs, adding up to 12.
//
// Used by BOTH AddOnModal (menu grid) and ProductDetail (product page) so the
// two can't drift apart.
//
// The + button disables when another step would break a rule, so an invalid
// combination is unreachable rather than rejected after the fact.

import React from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import {
  normalizeGroup,
  summarize,
  validateSelection,
  stepUpTo,
  stepDownTo,
} from "../utils/addonRules";

const QuantityAddOnGroup = ({ group: raw, value = {}, onChange }) => {
  const group = normalizeGroup(raw);
  const { total, count } = summarize(group, value);
  const { valid, errors } = validateSelection(group, value);

  const set = (label, qty) => {
    const next = { ...value };
    if (qty > 0) next[label] = qty;
    else delete next[label];
    onChange(next);
  };

  const remaining = group.totalQty === null ? null : group.totalQty - total;

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">
              {group.groupName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {group.totalRule === "upTo" ? "Up to" : "Choose"}{" "}
              {group.totalQty} in multiples of {group.step}
              {group.minPerOption > 0 && ` · min ${group.minPerOption} each`}
              {group.maxOptions !== null && ` · up to ${group.maxOptions} types`}
            </p>
          </div>

          {group.totalQty !== null && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                valid && total > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {total} / {group.totalQty}
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="divide-y">
        {group.options.map((opt) => {
          const qty = Number(value[opt.label]) || 0;
          const up = stepUpTo(group, value, opt.label);
          const down = stepDownTo(group, value, opt.label);
          const locked =
            qty === 0 && group.maxOptions !== null && count >= group.maxOptions;

          return (
            <div
              key={opt.label}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium ${
                    locked ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {opt.label}
                </p>
                {locked ? (
                  <p className="text-xs text-gray-400">
                    Remove another type first
                  </p>
                ) : (
                  qty > 0 && (
                    <p className="text-xs text-green-600">{qty} selected</p>
                  )
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => set(opt.label, down)}
                  disabled={down === null}
                  aria-label={`Remove ${group.step} ${opt.label}`}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 transition active:scale-95 disabled:opacity-30"
                >
                  <FiMinus size={16} />
                </button>

                <span className="w-7 text-center text-sm font-semibold text-gray-900 tabular-nums">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => set(opt.label, up)}
                  disabled={up === null}
                  aria-label={`Add ${group.step} ${opt.label}`}
                  className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center transition active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live status — tells them what's left instead of failing at checkout */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        {valid ? (
          <p className="text-xs font-medium text-green-600">
            {total > 0 ? "Looks good" : "Optional — skip if you like"}
          </p>
        ) : (
          <p className="text-xs font-medium text-amber-600">
            {remaining !== null && remaining > 0
              ? `Add ${remaining} more to continue`
              : errors[0]}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuantityAddOnGroup;