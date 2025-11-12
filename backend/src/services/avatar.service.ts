import AvatarConfig from "../models/AvatarConfig.model.js";

export async function getAvatar(childID: string) {
  return AvatarConfig.findOne({ childID });
}

export async function upsertAvatar(childID: string, payload: any) {
  const updated = await AvatarConfig.findOneAndUpdate(
    { childID },
    { childID, ...payload },
    { new: true, upsert: true }
  );
  return updated;
}
