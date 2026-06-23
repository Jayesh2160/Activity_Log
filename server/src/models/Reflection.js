import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    win: { type: String, trim: true, maxlength: 500, default: "" },
    distraction: { type: String, trim: true, maxlength: 500, default: "" },
    tomorrow: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

reflectionSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Reflection", reflectionSchema);
