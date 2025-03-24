import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
  message: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstanace.get("message/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in get users", error.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstanace.get(`message/${userId}`);
      set({ message: res.data });
    } catch (error) {
      console.log("Error in get messages", error.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // todo: Optimize this one later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
