import mongoose, { Schema } from "mongoose";

const EmotionDetectedSchema = new Schema({
  timestamp: { type: String, required: true },
  emotion: { type: String, required: true },
  confidence: { type: Number, required: true }
}, { _id: false });

const GameSessionSchema = new Schema({
  childID: { type: Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  gameId: { type: String, required: true },
  level: { type: Number, enum: [1,2,3], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  score: { type: Number, required: true },
  stars: { type: Number, enum: [1,2,3], required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  emotionDetected: { type: [EmotionDetectedSchema], default: [] },
  sessionStatus: { type: String, enum: ["completed","interrupted","abandoned"], required: true }
}, { timestamps: true });

export default mongoose.model("GameSession", GameSessionSchema);
