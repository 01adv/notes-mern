import { config as configDotenv } from "dotenv";
// import config from "./config.json" assert { type: "json" };
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authenticateToken from "./utilities.js";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";

// Load environment variables from .env file
configDotenv();

// dono shi h ek m values files se aa rhi h or second wale m env file se
// mongoose.connect(config.connectionString)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide all fields",
    });
  }
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Account created successfully",
  });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide all fields",
    });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({
      error: true,
      message: "User does not exist",
    });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      message: "Login successful",
      accessToken,
      email,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials",
    });
  }
});

//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const user = req.user; // Directly access the user object

  const isUser = await User.findOne({ _id: user?.user?.user?._id });

  if (!isUser) {
    return res.status(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createOn,
    },
    message: "User fetched successfully",
  });
});

//add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user; // Directly access the user object

  if (!title) {
    return res.status(400).json({
      error: true,
      message: "Please provide title",
    });
  }
  if (!content) {
    return res.status(400).json({
      error: true,
      message: "Please provide content",
    });
  }

  try {
    const note = new Note({
      title,
      content,
      tags,
      userId: user?.user?.user?._id, // Access the _id directly from the user object
    });
    await note.save();

    return res.json({
      error: false,
      message: "Note added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Could not add note",
      err,
    });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user; // Directly access the user object

  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: "no changes provided",
    });
  }

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: user?.user?.user?._id,
    });

    if (!note) {
      return res.status(400).json({
        error: true,
        message: "Note does not exist",
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.get("/all-notes/", authenticateToken, async (req, res) => {
  const user = req.user; // Directly access the user object

  const userId = user?.user?.user?._id;

  try {
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const user = req.user; // Directly access the user object
  const noteId = req.params.noteId;
  const userId = user?.user?.user?._id;

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(400).json({
        error: true,
        message: "Note does not exist",
      });
    }

    await Note.deleteOne({ _id: noteId, userId });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const user = req.user; // Directly access the user object

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: user?.user?.user?._id,
    });

    if (!note) {
      return res.status(400).json({
        error: true,
        message: "Note does not exist",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note pinned successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});

export default app;
