const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check token exists
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    // Bearer token
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, "mysecretkey");

    // store user info
    req.user = verified;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;