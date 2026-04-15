import axiosClient from "../config/axiosClient";

/**
 * Login via ms-auth
 */
export const login = async (username, password) => {
  const res = await axiosClient.post("/api/auth/login", {
    username,
    password,
  });
  return res.data;
};

/**
 * Refresh token
 */
export const refreshToken = async (refresh_token) => {
  const res = await axiosClient.post("/refresh", null, {
    params: { refresh_token },
  });
  return res.data;
};

/**
 * Logout
 */
export const logout = async (refresh_token) => {
  await axiosClient.post("/logout", null, {
    params: { refresh_token },
  });
};