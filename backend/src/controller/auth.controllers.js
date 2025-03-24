import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const SignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    if (password?.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName: fullName,
        email: email,
        password: hashedPassword,
      });

      if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        return res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    }
  } catch (error) {
    console.log("Error in singup controller" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller" + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("error in logout controller" + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(400).json({ message: "Profile Pic is required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateImage = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updateImage);
  } catch (error) {
    console.error("error in update profile" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const CheckAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("error in check auth" + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
