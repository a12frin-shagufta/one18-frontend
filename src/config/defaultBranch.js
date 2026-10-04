/* The 826 Tampines outlet closed (client request, 4 Oct 2026).
   This fallback is used when an order arrives without a branch, so it must
   never point at a closed outlet — orders would be routed to a shut shop. */
export const DEFAULT_BRANCH = {
  id: "696b25f8f5f3ced6b3de4982", // North Bridge — EXACT Mongo _id
  name: "One18 Bakery North Bridge",
  address: "North Bridge Road, Singapore",
};