const {
  register,
  login,
  getUserById,
  tweet,
  updateProfile,
  getPostById,
} = require("../controllers");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("Hiii");
});

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.post("/tweet", tweet);
router.patch("/user", updateProfile);

// router.post('/unfollow/:id',)

module.exports = router;
