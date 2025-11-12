// @/models/ChildProfile.model.ts
import mongoose, { Schema } from "mongoose";

const EmotionHistorySchema = new Schema({
  timestamp: { type: String, required: true },
  emotion: { type: String, required: true },
  confidence: { type: Number, required: true }
}, { _id: false });

const ProgressHistorySchema = new Schema({
  level: { type: Number, required: true },
  completedAt: { type: String, required: true },
  gamesCompleted: { type: Number, required: true }
}, { _id: false });

const GameScoreSchema = new Schema({
  level: { type: Number, required: true },
  gameId: { type: String, required: true }, // Using gameTitle as ID
  gameTitle: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  stars: { type: Number, required: true },
  completedAt: { type: String, required: true }
}, { _id: false });

// ✅ ADDED: This schema perfectly matches your frontend's 'progress' state
const LevelProgressSchema = new Schema({
  game1Completed: { type: Boolean, default: false },
  game2Completed: { type: Boolean, default: false },
  game3Completed: { type: Boolean, default: false },
  game4Completed: { type: Boolean, default: false },
  game5Completed: { type: Boolean, default: false },
  game6Completed: { type: Boolean, default: false },
  lastPlayedGame: { type: Number, default: null }
}, { _id: false });

const ChildProfileSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 7, max: 12 },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  autismSupportLevel: { type: Number, enum: [1, 2, 3], required: true },
  avatarConfig: {
    seed: { type: String, default: "" },
    style: { type: String, default: "" },
    enhancements: { type: [String], default: [] }
  },
  emotionHistory: { type: [EmotionHistorySchema], default: [] },
  progressHistory: { type: [ProgressHistorySchema], default: [] },
  gameScores: { type: [GameScoreSchema], default: [] },
  
  // ✅ CHANGED: Renamed to currentLevel for clarity with frontend
  currentLevel: { type: Number, default: 1 }, 

  // ✅ ADDED: This is the key field for saving progress.
  // It will store data like: { "1": { game1Completed: true, ... }, "2": { ... } }
  levelProgress: {
    type: Map,
    of: LevelProgressSchema,
    default: {}
  }
}, { timestamps: true });

export type ChildProfileDoc = mongoose.Document & {
  name: string;
  // ... other fields
  levelProgress: Map<string, typeof LevelProgressSchema>;
};

export default mongoose.model<ChildProfileDoc>("ChildProfile", ChildProfileSchema);