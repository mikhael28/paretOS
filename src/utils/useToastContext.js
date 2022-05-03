import { useContext } from "react";
import ToastContext from "../state/ToastContext";

export default function useToastContext() {
  return useContext(ToastContext);
}
