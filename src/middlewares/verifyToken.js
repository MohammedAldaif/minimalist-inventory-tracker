const admin = require("../../node_modules/firebase-admin"); // Adjust path if needed

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach the decoded token (including uid) to the request
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;