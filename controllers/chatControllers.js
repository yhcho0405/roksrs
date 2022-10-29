const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const getScore = require('../ai/classifier.js')

//@description     Returns NLP severity score of text
//@route           POST /api/chat/score
//@access          Protected
const gettextScore = asyncHandler(async (req, res) => {
  const text = req.query.text
  let results = {
    score: await getScore(text)
  }
  res.send(results)
})
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const {
    userId
  } = req.body;

  if (!userId) {
    console.log("잘못된 요청입니다.(UserId param not sent with request)");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
      isGroupChat: false,
      $and: [{
          users: {
            $elemMatch: {
              $eq: req.user._id
            }
          }
        },
        {
          users: {
            $elemMatch: {
              $eq: userId
            }
          }
        },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic dodId",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({
        _id: createdChat._id
      }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
        users: {
          $elemMatch: {
            $eq: req.user._id
          }
        }
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({
        updatedAt: -1
      })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic dodId",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      message: "모든 정보를 입력하세요"
    });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("두명 이상의 사용자가 필요합니다.");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({
        _id: groupChat._id
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const {
    chatId,
    chatName
  } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
      chatId, {
        chatName: chatName,
      }, {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat을 찾을 수 없습니다.");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const {
    chatId,
    userId
  } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
      chatId, {
        $pull: {
          users: userId
        },
      }, {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat을 찾을 수 없습니다.");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const {
    chatId,
    userId
  } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
      chatId, {
        $push: {
          users: userId
        },
      }, {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat을 찾을 수 없습니다.");
  } else {
    res.json(added);
  }
});

module.exports = {
  gettextScore,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
