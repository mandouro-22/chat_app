import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUserForSidebar" + error?.Message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const myMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(myMessages);
  } catch (error) {
    console.error("Error in Get Messages" + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req?.user?._id;

    if (!senderId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Sender ID is missing" });
    }

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Message text or image is required" });
    }

    let imageURL = null;

    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageURL = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", cloudinaryError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log(`Sending message to socket ID: ${receiverSocketId}`);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in Send Message Controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
