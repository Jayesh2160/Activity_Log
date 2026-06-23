import { Router } from "express";
import Reflection from "../models/Reflection.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/:date", async (req, res, next) => {
  try {
    const reflection = await Reflection.findOne({
      user: req.userId,
      date: req.params.date,
    });
    res.json({ reflection });
  } catch (error) {
    next(error);
  }
});

router.put("/:date", async (req, res, next) => {
  try {
    const reflection = await Reflection.findOneAndUpdate(
      { user: req.userId, date: req.params.date },
      {
        $set: {
          win: req.body.win || "",
          distraction: req.body.distraction || "",
          tomorrow: req.body.tomorrow || "",
        },
        $setOnInsert: { user: req.userId, date: req.params.date },
      },
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ reflection });
  } catch (error) {
    next(error);
  }
});

export default router;
