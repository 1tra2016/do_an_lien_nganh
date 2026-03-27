import axios from "axios";

const url = "http://localhost:8080";

export const userAPI = axios.create({
  baseURL: url + '/api/users',
  headers: {
    "Content-Type": "application/json",
  },
});
export const cartAPI = axios.create({
  baseURL: url + '/api/carts',
  headers: {
    "Content-Type": "application/json",
  },
});
export const itemAPI = axios.create({
  baseURL: url + '/api/laptops',
  headers: {
    "Content-Type": "application/json",
  },
});
export const couponAPI = axios.create({
  baseURL: url + '/api/coupons',
  headers: {
    "Content-Type": "application/json",
  },
});
export const userCouponAPI = axios.create({
  baseURL: url + '/api/users',
  headers: {
    "Content-Type": "application/json",
  },
});
export const brandAPI = axios.create({
  baseURL: url + '/api/brands',
  headers: {
    "Content-Type": "application/json",
  },
});