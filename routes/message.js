const router = require("express").Router();
const Chat = require("../model/Chat");
const User = require("../model/User");
const Conversation = require("../model/Conversation");
const jwtVerify = require('../middleware/jwtVerify')
// Create new message

router.post("/", jwtVerify, async (req, res) => {
  const { content, chatId } = req.body;
  
  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid Data!!!" });
  }

  let newMessage = {
    sender: req.user,
    content,
    chat: chatId,
  };

  try {
      let message = await Chat.create(newMessage)

      message = await message.populate('sender', 'name username profilePic')
      message = await message.populate('chat')
      message = await User.populate(message, {
          path: "chat.users",
          select: "name profilePic username"
      })

      await Conversation.findByIdAndUpdate(chatId, { latestMessage: message })

      res.status(201).json(message)

  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get all message from a conversation

router.get("/:id", jwtVerify, async (req, res) => {
  try {
    const message = await Chat.find({ chat: req.params.id })
      .populate("sender", "name profilePic username")
      .populate("chat");
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
