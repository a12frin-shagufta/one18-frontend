import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getFestivals = async () => {
  const res = await axios.get(`${BASE_URL}/api/festivals`);
  return res.data;
};

export const getMenu = async (branchId) => {
  const res = await axios.get(`${BASE_URL}/api/menu`, {
    params: branchId ? { branch: branchId } : {},
  });

  return res.data;
};
