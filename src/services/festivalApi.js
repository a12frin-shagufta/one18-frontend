import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getFestivals = async () => {
  const res = await axios.get(`${BASE_URL}/api/festivals`);
  return res.data;
};

/**
 * Get menu items
 /**
 * Get menu items (branch-independent)
 * @param {string} festivalId - optional festival id
 */

 
export const getMenu = async (festivalId) => {
  const params = {};

  // ✅ Festival filter is allowed
  if (festivalId) params.festival = festivalId;

  const res = await axios.get(`${BASE_URL}/api/menu`, { params });
  return res.data;
};
