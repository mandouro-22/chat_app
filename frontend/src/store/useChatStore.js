import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
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
  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    try {
      const res = await axiosInstanace.post(
        `message/send/${selectedUser?._id}`,
        messageData
      );
      console.log(selectedUser?._id);
      if (res.data.receiverId === selectedUser?._id) {
        set((state) => ({
          message: [...state.message, res.data].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          ),
        }));
      }
    } catch (error) {
      console.log("error in send massage", error);
      toast.error(error?.response?.data?.error);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      const isMessageSentFromSelectedUser =
        message?.senderId === selectedUser?._id;
      if (!isMessageSentFromSelectedUser) return;
      set({ message: [...get().message, message] });
    });
  },

  unSubscribToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  // todo: Optimize this one later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
