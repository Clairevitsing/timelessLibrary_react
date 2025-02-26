import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ErrorResponse {
  errors?: string[] | Record<string, string[]>;
  data?: string;
}

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorData = axiosError.response?.data;

    if (errorData) {
      if (Array.isArray(errorData.errors)) {
        errorData.errors.forEach(val => toast.warning(val));
      } else if (typeof errorData.errors === "object") {
        Object.values(errorData.errors).forEach(errors => {
          if (Array.isArray(errors)) {
            errors.forEach(e => toast.warning(e));
          }
        });
      } else if (typeof errorData === "string") {
        toast.warning(errorData);
      }
    } else if (axiosError.response?.status === 401) {
      toast.warning("Please login");
      window.history.pushState({}, "LoginPage", "/login");
    } else {
      toast.warning("An unknown error occurred");
    }
  } else {
    toast.error("A non-Axios error occurred");
  }
};