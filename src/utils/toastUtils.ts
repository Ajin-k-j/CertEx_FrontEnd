import { toast } from "react-toastify";

export const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
};
