const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const jwtVerify = require("../middleware/jwtVerify");
const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig");
const upload = multer({ storage });

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const userExist = await User.findOne({ username: username });

    if (userExist)
      return res.status(400).json({ message: "User already exists!" });

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      username,
      password: hashedPass,
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user.id }, "SECRET KEY", {
      expiresIn: "3hr",
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    const { password: pw, ...rest } = user._doc;
    res.status(201).json(rest);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) return res.status(400).json({ message: "User doesn't exist!" });

    const passDidMatch = await bcrypt.compare(password, user.password);
    if (!passDidMatch) {
      return res.status(403).json({ message: "Invalid Auth Details" });
    }

    const token = jwt.sign({ id: user.id }, "SECRET KEY", {
      expiresIn: "3hr",
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    const { password: pw, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/", jwtVerify, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/logout", jwtVerify, async (req, res) => {
  res.removeHeader("Set-Cookie");
  res.clearCookie("auth");
  res.status(200).json({ message: "User logged out successfully" });
});

router.post("/:id", jwtVerify, upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const image = req.file.path;
  try {
    let user = await User.findByIdAndUpdate(id, { profilePic: image });
    res.status(201).json({ message: "Profile Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/:id", jwtVerify, async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { name: name });
    res.status(201).json({ message: "Profile Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
