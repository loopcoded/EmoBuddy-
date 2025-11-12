import ChildProfile from "../models/ChildProfile.model.js";
import ParentProfile from "../models/ParentProfile.model.js";
import { Types } from "mongoose";

type RegisterPayload = {
  parentName: string;
  parentEmail: string;
  phoneNumber: string;
  childName: string;
  childAge: number;
  childGender: "Male"|"Female"|"Other";
  autismSupportLevel: 1|2|3;
  cameraPermission: boolean;
  micPermission: boolean;
};

export async function registerChild(payload: RegisterPayload) {
  const child = await ChildProfile.create({
    name: payload.childName,
    age: payload.childAge,
    gender: payload.childGender,
    autismSupportLevel: payload.autismSupportLevel,
    currentLevel: 1
  });

  await ParentProfile.create({
    parentName: payload.parentName,
    parentEmail: payload.parentEmail,
    phoneNumber: payload.phoneNumber,
    cameraPermission: payload.cameraPermission ?? false,
    micPermission: payload.micPermission ?? false,
    childID: child._id
  });

  return child;
}

export async function updateChildProfile(childID: string, payload: Record<string, any>) {
  // Only allow updating specific, safe fields
  const safePayload: Record<string, any> = {};
  if (payload.currentLevel) {
    safePayload.currentLevel = payload.currentLevel;
  }
  if (payload.avatarConfig) {
    safePayload.avatarConfig = payload.avatarConfig;
  }
  // Add other fields here as needed

  return ChildProfile.findByIdAndUpdate(childID, { $set: safePayload }, { new: true });
}

export async function getChildProfile(childID: string) {
  return ChildProfile.findById(childID);
}

export async function deleteChild(childID: string) {
  const id = new Types.ObjectId(childID);
  await Promise.all([
    ChildProfile.findByIdAndDelete(id),
    ParentProfile.deleteMany({ childID: id })
  ]);
  return true;
}
