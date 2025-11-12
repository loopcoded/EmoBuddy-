import mongoose, { Schema } from "mongoose"

const EmotionDataSchema = new Schema(
  {
    childID: { type: String, required: true },
    emotion: { type: String, required: true },
    confidence: { type: Number, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model("EmotionData", EmotionDataSchema)
