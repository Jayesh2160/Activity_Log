import { Router } from "express";
import Activity from "../models/Activity.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function validate(body) {
  if (!body.title?.trim() || !body.date || !body.startTime || !body.endTime) {
    return "Activity, date, start time, and end time are required.";
  }
  if (body.endTime <= body.startTime) return "End time must be after start time.";
  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const query = { user: req.userId };
    if (req.query.date) query.date = req.query.date;
    if (req.query.category) query.category = req.query.category;
    const activities = await Activity.find(query).sort({ date: -1, startTime: 1 });
    res.json({ activities });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const message = validate(req.body);
    if (message) return res.status(400).json({ message });
    const activity = await Activity.create({
      ...req.body,
      title: req.body.title.trim(),
      user: req.userId,
    });
    res.status(201).json({ activity });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const message = validate(req.body);
    if (message) return res.status(400).json({ message });
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!activity) return res.status(404).json({ message: "Activity not found." });
    res.json({ activity });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!activity) return res.status(404).json({ message: "Activity not found." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
