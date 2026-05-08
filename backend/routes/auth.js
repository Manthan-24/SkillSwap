const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created!");
  } catch (err) { console.error(err); res.status(500).json(err); }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).json("Wrong credentials!");


    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      "mysecretkey",
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({...others,token});
  } catch (err) { console.error(err); res.status(500).json(err); }
});

router.get("/all-users",verifyToken, async (req, res) => {
  try { res.status(200).json(await User.find({}, { password: 0 })); }
  catch (err) { console.error(err); res.status(500).json(err); }
});

router.put("/update-skills/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(user);
  } catch (err) { console.error(err); res.status(500).json(err); }
});

module.exports = router;