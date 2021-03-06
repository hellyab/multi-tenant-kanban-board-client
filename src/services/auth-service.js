import { axiosInstance } from "./constants";

export const setAuthHeader = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const signIn = ({ email, password }) => {
  const req = new Request(`${process.env.REACT_APP_API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return fetch(req).then(async (res) => {
    let resJSON = await res.json();
    if (res.status < 200 || res.status >= 300) {
      return Promise.reject(resJSON);
    }
    setAuthHeader(resJSON.accessToken);
    localStorage.setItem("token", resJSON.accessToken);
    localStorage.setItem("refreshToken", resJSON.refreshToken);
    return Promise.resolve(resJSON);
  });
};

export const refreshToken = () => {
  const req = new Request(`${process.env.REACT_APP_API_URL}/users/refresh`, {
    method: "POST",
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return fetch(req).then(async (res) => {
    let resJSON = await res.json();
    if (res.status < 200 || res.status >= 300) {
      return Promise.reject(resJSON);
    }
    setAuthHeader(resJSON.accessToken);
    localStorage.setItem("token", resJSON.accessToken);
    return Promise.resolve(resJSON);
  });
};
