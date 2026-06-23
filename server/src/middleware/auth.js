import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies.daymark_token;
  if (!token) return res.status(401).json({ message: "Please sign in." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired." });
  }
}
