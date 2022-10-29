const express = require("express");
const {
  getuserbyid,
  getUsersInUnit,
  registerUser,
  authUser,
  allUsers,
  addUser,
  updateUser,
  updateUser2,
  updatePic
} = require("../controllers/userControllers");
const {
  protect,
  onlyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers); //protect,
router.route("/id").get(protect, getuserbyid); //protect,
router.route("/unit").get(protect, getUsersInUnit); //protect,
router.route("/").put(protect, updateUser);
router.route("/updateweb").post(protect, updateUser2);
router.route("/pic").put(protect, updatePic); //protect,
router.route("/add").post(onlyAdmin, addUser);
router.route("/register").post(registerUser);
router.post("/login", authUser);

module.exports = router;
