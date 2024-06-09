import axios, { type InternalAxiosRequestConfig } from "axios";
import { COOKIE_TOKEN, COOKIE_DOMAIN, COOKIE_PATH } from "./constants";
import cookie from "js-cookie";

const REDIRECT_AUTH_URL = import.meta.env.VITE_APP_REDIRECT_AUTH_URL;

const COOKIE_OPTIONS = { path: COOKIE_PATH, domain: COOKIE_DOMAIN };

function removeToken() {
  cookie.remove(COOKIE_TOKEN, COOKIE_OPTIONS);
}
export const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use(// @ts-ignore

  (config: any) => {
    if (cookie.get(COOKIE_TOKEN)) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${cookie.get(COOKIE_TOKEN)}`,
        },
      } as InternalAxiosRequestConfig;
    }
    removeToken();
    window.location.replace(
      `${REDIRECT_AUTH_URL}?redirect=${window.location.href}`
    );
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (config) => config,
  (error) => {
    console.log(error);

    if (error && error.response.status === 401) {
      removeToken();
      window.location.replace(
        `${REDIRECT_AUTH_URL}?redirect=${window.location.href}`
      );
      return Promise.reject(error);
    }// @ts-ignore
    throw new Error("status", {// @ts-ignore
      cause: { status: error.response.status, message: error.response },
    });
  }
);
