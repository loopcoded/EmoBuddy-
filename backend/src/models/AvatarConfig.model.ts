import mongoose, { Schema } from "mongoose";

const AvatarConfigSchema = new Schema({
  childID: { type: Schema.Types.ObjectId, ref: "ChildProfile", unique: true, required: true },
  seed: { type: String, required: true },
  style: { type: String, required: true },
  enhancements: {
    level1: { type: [String], default: [] },
    level2: { type: [String], default: [] },
    level3: { type: [String], default: [] }
  },
  colors: {
    primary: { type: String, default: "#000000" },
    secondary: { type: String, default: "#ffffff" }
  }
}, { timestamps: true });

export default mongoose.model("AvatarConfig", AvatarConfigSchema);
