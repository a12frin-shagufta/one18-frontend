import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getFestivals = async () => {
  const res = await axios.get(`${BASE_URL}/api/festivals`);
  return res.data;
};

/**
 * Get menu items
 * @param {string} branchId  - selected branch id
 * @param {string} festivalId - optional festival id
 */
export const getMenu = async (branchId, festivalId) => {
  const params = {};

  if (branchId) params.branch = branchId;
  if (festivalId) params.festival = festivalId;

  const res = await axios.get(`${BASE_URL}/api/menu`, { params });
  return res.data;
};
