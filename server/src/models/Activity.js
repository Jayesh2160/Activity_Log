import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    category: {
      type: String,
      enum: ["productive", "necessary", "rest", "unwanted"],
      default: "productive",
    },
    area: {
      type: String,
      enum: ["work", "study", "health", "personal", "social", "other"],
      default: "other",
    },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    trigger: { type: String, trim: true, maxlength: 200, default: "" },
    interrupted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

activitySchema.index({ user: 1, date: 1, startTime: 1 });

export default mongoose.model("Activity", activitySchema);
