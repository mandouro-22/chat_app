import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5050" : "/api";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstanace.get("/auth/checker");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in use auth store" + error?.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstanace.post("/auth/register", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Registration Successful");
    } catch (error) {
      console.error("Error in Singup" + error?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstanace.post("/auth/logout");
      set({ authUser: null });
      get().disConnectSocket();
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.error("Error in Logout" + error?.message);
      toast.error(error?.response?.data?.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstanace.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Login Successful");
    } catch (error) {
      console.error("Error in Login" + error?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstanace.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error in Update Profile" + error?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser && get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser?._id,
      },
    });

    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: Array.isArray(userIds) ? userIds : [] });
    });
  },

  disConnectSocket: () => {
    if (get().socket?.connect) return get().socket?.disconnect();
  },
}));
