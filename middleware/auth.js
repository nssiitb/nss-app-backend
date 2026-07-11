const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../config/db");

const auth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.warn("JWT verify failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.jti) {
    try {
      const [rows] = await db.execute(
        "SELECT 1 FROM revoked_tokens WHERE jti = ? LIMIT 1",
        [decoded.jti],
      );
      if (rows.length > 0) {
        return res.status(401).json({ message: "Token revoked" });
      }
    } catch (err) {
      console.error("Revocation check failed:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  req.user = decoded;
  req.token = decoded;
  next();
};

module.exports = auth;
