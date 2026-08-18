// src/utils/useBundleCheck.js
//
// Checks that every quantity-mode bundle in the cart adds up to its configured
// size — e.g. a 12pc croissant box really has 12 pieces across its flavours.
//
// Why this exists: cart lines don't store the rule they were built under, and
// a cart can sit in localStorage for days (including from before a fix). The
// backend already rejects a bad bundle on order creation, but that happens
// AFTER the customer has filled in the whole checkout form. This catches it in
// the cart instead.
//
// IMPORTANT — this fails OPEN. If the menu can't be fetched, or a product has
// no rule, it reports "valid". Blocking checkout because an analytics-ish
// lookup failed would cost real orders; a wrong bundle is caught by the server
// anyway. Never let this be the reason someone can't pay.

import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useBundleCheck = () => {
  // { [productId]: { [groupName]: totalQty } }
  const [rules, setRules] = useState(null); // null = not loaded yet

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${BACKEND_URL}/api/menu`)
      .then((res) => {
        if (cancelled) return;
        const map = {};
        (res.data || []).forEach((product) => {
          (product.addOns || []).forEach((group) => {
            if (group.mode !== "quantity" || !group.totalQty) return;
            map[product._id] = map[product._id] || {};
            map[product._id][group.groupName] = Number(group.totalQty);
          });
        });
        setRules(map);
      })
      .catch(() => {
        if (!cancelled) setRules({}); // fail open
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * @returns [{ groupName, expected, actual }] — empty when fine.
   */
  const getIssues = (item) => {
    if (!rules) return []; // still loading — don't block
    const productRules = rules[item.itemId];
    if (!productRules) return [];

    const totals = {};
    (item.addOns || []).forEach((a) => {
      if (!(a.groupName in productRules)) return;
      totals[a.groupName] =
        (totals[a.groupName] || 0) + (Number(a.quantity) || 0);
    });

    return Object.entries(productRules)
      .map(([groupName, expected]) => ({
        groupName,
        expected,
        actual: totals[groupName] || 0,
      }))
      .filter((r) => r.actual !== r.expected);
  };

  /** True when at least one cart line has a bundle that doesn't add up. */
  const hasIssues = (items = []) => items.some((i) => getIssues(i).length > 0);

  /** One short sentence naming the first problem, for a toast or banner. */
  const firstIssueMessage = (items = []) => {
    for (const item of items) {
      const [issue] = getIssues(item);
      if (issue) {
        return `${item.name}: ${issue.actual} of ${issue.expected} pieces selected. Please remove it and add it again with your flavours.`;
      }
    }
    return null;
  };

  return { getIssues, hasIssues, firstIssueMessage, rulesLoaded: rules !== null };
};