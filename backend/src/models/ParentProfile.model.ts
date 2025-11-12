import mongoose, { Schema } from "mongoose";

const ParentProfileSchema = new Schema({
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cameraPermission: { type: Boolean, default: false },
  micPermission: { type: Boolean, default: false },
  childID: { type: Schema.Types.ObjectId, ref: "ChildProfile", required: true }
}, { timestamps: true });

export default mongoose.model("ParentProfile", ParentProfileSchema);
