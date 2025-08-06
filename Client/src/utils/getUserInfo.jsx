import axios from "../utils/axios";
import { setUser } from "../store/userSlice";
import toast from "react-hot-toast";

export const getUserInfo = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("/api/user/get", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(setUser(res.data?.user));
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error fetching user info");
  }
};
