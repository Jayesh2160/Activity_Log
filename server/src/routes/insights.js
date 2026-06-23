import { Router } from "express";
import Activity from "../models/Activity.js";
import { requireAuth } from "../middleware/auth.js";
import { dateDaysAgo, minutesBetween } from "../utils/time.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const from = req.query.from || dateDaysAgo(6);
    const activities = await Activity.find({
      user: req.userId,
      date: { $gte: from },
    }).lean();

    const totals = { productive: 0, necessary: 0, rest: 0, unwanted: 0 };
    const days = {};
    const unwantedTitles = {};
    const productiveHours = {};

    for (const item of activities) {
      const minutes = minutesBetween(item.startTime, item.endTime);
      totals[item.category] += minutes;
      days[item.date] ||= { productive: 0, necessary: 0, rest: 0, unwanted: 0 };
      days[item.date][item.category] += minutes;

      if (item.category === "unwanted") {
        unwantedTitles[item.title] = (unwantedTitles[item.title] || 0) + minutes;
      }
      if (item.category === "productive") {
        const hour = Number(item.startTime.slice(0, 2));
        productiveHours[hour] = (productiveHours[hour] || 0) + minutes;
      }
    }

    const topDistraction = Object.entries(unwantedTitles).sort((a, b) => b[1] - a[1])[0];
    const bestHour = Object.entries(productiveHours).sort((a, b) => b[1] - a[1])[0];
    const suggestions = [];

    if (bestHour) {
      suggestions.push({
        title: "Protect your strongest window",
        text: `Your productive work often starts around ${String(bestHour[0]).padStart(2, "0")}:00. Try reserving that hour for your hardest task.`,
      });
    }
    if (topDistraction) {
      suggestions.push({
        title: "Create an if–then plan",
        text: `"${topDistraction[0]}" is your largest unwanted activity. Try: “If I notice myself starting it, then I will pause and do five minutes of my intended task.”`,
      });
    }
    if (totals.rest < totals.productive * 0.12 && totals.productive > 240) {
      suggestions.push({
        title: "Schedule recovery",
        text: "You logged substantial focused time but little rest. A deliberate break may protect the next work block.",
      });
    }
    if (!suggestions.length) {
      suggestions.push({
        title: "Keep collecting honest data",
        text: "A few more logs will reveal your strongest hours and recurring distractions. Accuracy matters more than a perfect score.",
      });
    }

    res.json({
      totals,
      days: Object.entries(days)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, values]) => ({ date, ...values })),
      topDistractions: Object.entries(unwantedTitles)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, minutes]) => ({ title, minutes })),
      suggestions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
