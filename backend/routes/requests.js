const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// send new swap request
router.post("/send", verifyToken, async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const sender = await User.findById(req.body.senderId);
    if (sender.credits <= 0) return res.status(400).json("No credits!");
    const newReq = new Request(req.body);
    await newReq.save();
    if (io) io.to(req.body.receiverId).emit("new_notification", { 
      message: `${sender.name} wants to learn ${req.body.skillName}!` 
    });
    res.status(200).json("Request sent!");
  } catch (err) { console.error(err); res.status(500).json(err); }
});

// fetch user mailbox data
router.get("/my-inbox/:userId", verifyToken, async (req, res) => {
  try {
    const data = await Request.find({ $or: [{ receiverId: req.params.userId }, { senderId: req.params.userId }] })
      .populate("senderId receiverId", "name");
    res.status(200).json(data);
  } catch (err) { console.error(err); res.status(500).json(err); }
});

// handle request status updates
router.put("/update/:id", verifyToken, async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const { status } = req.body;
    if (status === "rejected") {
      await Request.findByIdAndDelete(req.params.id);
      return res.status(200).json("Request removed.");
    }

    const request = await Request.findById(req.params.id);
    
    // deduct credit from student
    const updatedStudent = await User.findByIdAndUpdate(
        request.senderId, 
        { $inc: { credits: -1 } }, 
        { new: true }
    );

    // add credit to teacher
    const updatedTeacher = await User.findByIdAndUpdate(
        request.receiverId, 
        { $inc: { credits: 1 } }, 
        { new: true }
    );

    request.status = "accepted";
    await request.save();

    // sync credits in real-time
    if (io) {
      io.to(request.senderId.toString()).emit("update_credits", { 
        updatedUser: updatedStudent 
      });
    }

    res.status(200).json({ updatedUser: updatedTeacher });
  } catch (err) { console.error(err); res.status(500).json(err); }
});

// remove completed swap session
router.delete("/end/:id", verifyToken, async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.status(200).json("Session completed.");
  } catch (err) { console.error(err); res.status(500).json(err); }
});

module.exports = router;