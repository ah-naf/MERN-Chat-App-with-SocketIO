const router = require("express").Router();
const jwtVerify = require("../middleware/jwtVerify");
const Conversation = require("../model/Conversation");
const User = require("../model/User");

// Create or access conversation
router.post("/", jwtVerify, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserID Required!!!" });
  }

  let isConversationExist = await Conversation.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isConversationExist = await User.populate(isConversationExist, {
    path: "latestMessage.sender",
    select: "name profilePic username",
  });

  if (isConversationExist.length > 0) {
    res.status(200).json(isConversationExist[0]);
  } else {
    let conversationData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user, userId],
    };
    try {
      const createConversation = await Conversation.create(conversationData);

      const conversation = await Conversation.findOne({
        _id: createConversation._id,
      }).populate("users", "-password");

      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
});

// fetch conversation for particular user
router.get("/", jwtVerify, async (req, res) => {
  try {
    let conversation = await Conversation.find({
      users: {
        $elemMatch: { $eq: req.user },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    conversation = await Conversation.populate(conversation, {
      path: "latestMessage.sender",
      select: "name profilePic username",
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get specific conversation
router.get("/:id", jwtVerify, async (req, res) => {
  const id = req.params.id
  try {
    let conversation = await Conversation.findById(id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")

    conversation = await User.populate(conversation, {
      path: "latestMessage.sender",
      select: "name profilePic username",
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Create group conversation
router.post("/group", jwtVerify, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  let users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user);

  try {
    let groupChat = await Conversation.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    groupChat = await Conversation.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Rename particular group
router.put("/rename", jwtVerify, async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Conversation.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat)
      return res.status(400).json({ message: "Conversation Not Found!!!" });
    else return res.status(201).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Add user to group
router.post("/groupadd", jwtVerify, async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Conversation.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added)
      return res.status(400).json({ message: "Conversation Not Found!!!" });
    else return res.json(added);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
});

// Remove user from group
router.put("/groupremove", jwtVerify, async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Conversation.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed)
      return res.status(400).json({ message: "Conversation Not Found!!!" });
    else return res.json(removed);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
