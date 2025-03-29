import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageSkeleton } from "./Skeletons/MessageSkeleton";
import { MessageHeader } from "./MessageHeader";
import { MessageInput } from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import Avatar from "../assets/avatar.png";

export function ChatContainer() {
  const {
    message,
    selectedUser,
    isMessageLoading,
    getMessages,
    subscribeToMessage,
    unSubscribToMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessage();
    return () => unSubscribToMessage();
  }, [selectedUser?._id, getMessages, subscribeToMessage, unSubscribToMessage]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  if (isMessageLoading) return <MessageSkeleton />;

  return (
    <div className="flex flex-col flex-1">
      <MessageHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {message.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg?.senderId === authUser?._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}>
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePic || Avatar
                      : selectedUser.profilePic || Avatar
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
