// models/progress.model.ts
import mongoose, { Schema } from "mongoose";

const ProgressHistorySchema = new Schema({
  level: { type: Number, required: true },
  completedAt: { type: String, required: true },
  gamesCompleted: { type: Number, required: true },
}, { _id: false });

const ProgressSchema = new Schema({
  childID: { type: String, required: true, unique: true },
  levels: {
    type: Map,
    of: ProgressHistorySchema, // level1, level2, etc.
    default: {}
  },
}, { timestamps: true });

export const Progress = mongoose.model("Progress", ProgressSchema);
