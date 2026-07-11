const db = require("../config/db");

const logout = async (req, res) => {
  try {
    const decoded = req.user;

    if (!decoded || !decoded.jti || !decoded.exp) {
      return res.status(400).json({
        message: "Token cannot be revoked",
        status: false,
      });
    }

    const expiresAt = new Date(decoded.exp * 1000);

    // INSERT IGNORE — repeated logouts for the same token are idempotent.
    await db.execute(
      "INSERT IGNORE INTO revoked_tokens (jti, expires_at) VALUES (?, ?)",
      [decoded.jti, expiresAt],
    );

    // Best-effort cleanup of expired rows so the table doesn't grow forever.
    db.execute("DELETE FROM revoked_tokens WHERE expires_at < NOW()").catch(
      (err) => console.warn("Revoked-token cleanup failed:", err.message),
    );

    return res.status(200).json({
      message: "Logged out",
      status: true,
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

module.exports = logout;
