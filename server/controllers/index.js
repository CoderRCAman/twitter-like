const { getAuthDetails } = require("../middleware");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const { IncomingForm } = require("formidable");
const _ = require("lodash");
const path = require("path");
const Comment = require("../models/comment");
async function register(req, res) {
  const { user_name, email, password, name } = req.body;
  if (!user_name || !email || !password || !name)
    return res.status(400).json({
      msg: "Missing fields!",
    });
  try {
    const notUsernameUnique = await User.findOne({ user_name: user_name });
    const notEmailUnique = await User.findOne({ email: email });
    if (notUsernameUnique) {
      return res.status(400).json({ msg: "Username already exists!" });
    }

    if (notEmailUnique) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    const newUser = new User({
      user_name,
      email,
      password,
      name,
    });

    await newUser.save();
    return res.status(201).json({ msg: "User created!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR!" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if ((!email, !password))
    return res.status(400).json({
      msg: "Missing fields!",
    });
  try {
    const verifyEmail = await User.findOne({ email });
    if (!verifyEmail)
      return res.status(400).json({
        msg: `No such user exist with ${email} try again with a different email`,
      });
    if (!(await verifyEmail.isValidatedPassword(password)))
      return res
        .status(400)
        .json({ msg: `Password didnot match for email ${email}` });
    //set details in cookies
    res.cookie("isLoggedIn", true, {
      maxAge: 7 * 24 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("user_id", verifyEmail._id, {
      maxAge: 7 * 24 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      msg: "Successfully login",
      user_id: verifyEmail._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR!" });
  }
}

async function tweet(req, res) {
  const userDetails = getAuthDetails(req);
  const id = userDetails.user_id;
  options = {
    uploadDir: path.join(__dirname, "..", "pictures"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };

  const form = new IncomingForm(options);
  try {
    const followers = (await User.findById(id).select("followers")).followers;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        if (err.code === 1009)
          return res.status(500).json({ msg: "Maximum supported file is 5mb" });
        else return res.status(500).json({ msg: "Somethings went wrong!" });
      }

      if (_.isEmpty(files)) {
        const newTweet = new Tweet({
          content: fields.content,
          user_id: id,
        });
        await newTweet.save();
        await User.findByIdAndUpdate(id, {
          $addToSet: { tweets: newTweet._id },
        });

        await User.findByIdAndUpdate(id, {
          $addToSet: {
            feeds: newTweet._id,
          },
        });
        for (let i = 0; i < followers.length; i++) {
          const fid = followers[i];
          await User.findByIdAndUpdate(fid, {
            $addToSet: {
              notifications: newTweet._id,
              feeds: newTweet._id,
            },
          });
        }

        return res.status(200).json({ msg: "Tweeted!" });
      } else {
        const pictures = {
          download_url: `http://localhost:5000/${files.picture.newFilename}`,
          file_name: files.picture.newFilename,
        };
        const newTweet = new Tweet({
          content: fields.content,
          user_id: id,
          pictures: pictures,
        });
        await newTweet.save();
        await User.findByIdAndUpdate(id, {
          $addToSet: { tweets: newTweet._id },
        });

        await User.findByIdAndUpdate(id, {
          $addToSet: {
            feeds: newTweet._id,
          },
        });
        for (let i = 0; i < followers.length; i++) {
          const fid = followers[i];
          await User.findByIdAndUpdate(fid, {
            $addToSet: {
              notifications: newTweet._id,
              feeds: newTweet._id,
            },
          });
        }

        return res.status(200).json({ msg: "Tweeted!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function updateProfile(req, res) {
  const userDetails = getAuthDetails(req);
  const id = userDetails.user_id;
  console.log(id);
  options = {
    uploadDir: path.join(__dirname, "..", "pictures"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const form = new IncomingForm(options);
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        if (err.code === 1009)
          return res.status(500).json({ msg: "Maximum supported file is 5mb" });
        else return res.status(500).json({ msg: "Somethings went wrong!" });
      }

      if (_.isEmpty(files)) {
        await User.findByIdAndUpdate(id, {
          name: fields.name,
        });
        return res.status(200).json({ msg: "Updated!" });
      } else {
        const avatar = {
          download_url: `http://localhost:5000/${files.picture.newFilename}`,
          file_name: files.picture.newFilename,
        };

        await User.findByIdAndUpdate(id, {
          name: fields.name,
          avatar: avatar,
        });

        return res.status(200).json({ msg: "Updated!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      msg: `NO ID `,
    });
  try {
    const user = await User.findById(id)
      .populate("tweets")
      .populate({ path: "feeds", populate: "user_id" });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR!" });
  }
}

module.exports = {
  register,
  login,
  getUserById,
  tweet,
  updateProfile,
};
