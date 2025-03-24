import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageSkeleton } from "./Skeletons/MessageSkeleton";
import { MessageHeader } from "./MessageHeader";
import { MessageInput } from "./MessageInput";

export function ChatContainer() {
  // eslint-disable-next-line no-unused-vars
  const { message, selectedUser, isMessageLoading, getMessages } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser?._id);
  }, [selectedUser?._id, getMessages]);

  if (isMessageLoading) return <MessageSkeleton />;

  return (
    <div className="flex flex-col flex-1">
      <MessageHeader />
      <p>messages...</p>
      <MessageInput />
    </div>
  );
}
