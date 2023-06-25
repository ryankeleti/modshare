import mongoose from "mongoose";

const modSaveSchema = new mongoose.Schema(
  {
    modrinth_id: { type: String, required: true },
    saved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    saved_on: { type: Date, default: Date.now },
    is_private: { type: Boolean, default: false },
  },
  { collection: "mod_saves" }
);

const modSaveModel = mongoose.model("ModSave", modSaveSchema);

export const findModSaveById = async (id, requester) => {
  const modSave = await modSaveModel.findById(id);
  if (
    ["admin", "moderator"].includes(requester.role) ||
    modSave.saved_by === requester.id ||
    !modSave.is_private
  ) {
    return modSave;
  } else {
    return null;
  }
};

export const findUserModSaves = async (uid, requester) => {
  if (["admin", "moderator"].includes(requester.role) || uid === requester.id) {
    return await modSaveModel.find({ saved_by: uid });
  } else {
    return await modSaveModel.find({ saved_by: uid, is_private: false });
  }
};

export const findSaveForMod = async (uid, modrinth_id, requester) => {
  if (["admin", "moderator"].includes(requester.role) || uid === requester.id) {
    const modSave = await modSaveModel.findOne({ saved_by: uid, modrinth_id });
    if (!modSave || modSave.is_private) {
      return null;
    } else {
      return modSave;
    }
  } else {
    return null;
  }
};

export const findUsersThatSavedMod = async (modrinth_id, requester) => {
  if (["admin", "moderator"].includes(requester.role)) {
    return await modSaveModel
      .find({ modrinth_id }, "saved_by")
      .populate("saved_by")
      .exec();
  } else {
    return await modSaveModel
      .find({ modrinth_id, is_private: false }, "saved_by")
      .populate("saved_by")
      .exec();
  }
};

export const changeVisibility = async (id, is_private, requester) => {
  const modSave = await modSaveModel.findOneById(id);
  if (
    ["admin", "moderator"].includes(requester.role) ||
    modSave.saved_by === requester.id
  ) {
    await modSaveModel.findByIdAndUpdate(id, { is_private });
  }
};

export const createModSave = async (
  { modrinth_id, saved_by, is_private },
  requester
) => {
  if (requester.role === "admin" || saved_by == requester.id) {
    const exists = await modSaveModel.exists({ modrinth_id, saved_by });
    if (!exists) {
      await modSaveModel.create({ modrinth_id, saved_by, is_private });
    }
  }
};

export const deleteModSave = async (id, requester) => {
  const modSave = await modSaveModel.findById(id);
  if (modSave) {
    if (
      ["admin", "moderator"].includes(requester.role) ||
      modSave.saved_by === requester.id
    ) {
      await modSaveModel.deleteOne({ _id: id });
    }
  }
};
