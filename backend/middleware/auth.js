export function requireTeacher(req, res, next) {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }
  next();
}
