import axios from "axios";

export type AxiosResponse<T> = Promise<{
  success: boolean;
  data: T;
}>;

const instance = axios.create({
  baseURL: `${process.env.BACKEND_URL}/json`,
  timeout: 15000,
});

instance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  (error) => {
    // 오류 응답을 처리
    // ...
    return Promise.reject(error);
  }
);

export const _axios = instance;
