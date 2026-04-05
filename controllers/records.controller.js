const financialRecordModel = require("../models/records.model");
const userModel = require("../models/user.model");
const validator = require("validator");

exports.addRecord = async (req, res) => {
  const user = req.user;
  const { ...data } = req.body;

  try {
    if (user.role !== "analyst" && user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    if (!data.amount || !data.type || !data.category)
      return res.status(400).json({ message: "Missing required fields" });

    if (typeof data.amount != "number")
      return res.status(400).json({ message: "amount should be in numbers!" });

    if (data.type !== "income" && data.type !== "expense")
      return res.status(400).json({ message: "Invalid type" });

    let userId;

    if (user.role === "analyst") userId = user.id;

    if (user.role === "admin") {
      if (data.email) {
        if (!validator.isEmail(data.email)) {
          return res.status(400).json({ message: "Invalid email" });
        }

        const targetUser = await userModel.findOne({ email: data.email });

        if (!targetUser) {
          return res.status(404).json({ message: "User not found" });
        }
        userId = targetUser._id;
      } else {
        userId = user.id;
      }
    }

    const newRecord = new financialRecordModel({
      amount: data.amount,
      type: data.type,
      category: data.category,
      notes: data.notes,
      userId: userId,
    });
    
    await newRecord.save();

    return res.status(201).json({
      message: "Record added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.viewRecords = async (req, res) => {
  const user = req.user;
  try {
    //viewer cannot see records
    if (user.role == "viewer")
      return res.status(403).json({ message: "viewer cannot see records!" });

    //analyst records will be fetched from req.user.id
    if (user.role == "analyst") {
      let records = await financialRecordModel.find({ userId: user.id });
      if (records.length === 0)
        return res.status(400).json("No recirds found!");
      return res
        .status(200)
        .json({ message: "records fetched successfully", records: records });
    } else if (user.role == "admin") {
      const allRecords = await financialRecordModel.find({});
      return res
        .status(200)
        .json({ message: "Records fetched successfully", records: allRecords });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateRecords = async (req, res) => {
  const recordId = req.params.id;
  const user = req.user;
  const { ...data } = req.body;

  try {
    if (user.role == "viewer")
      return res
        .status(403)
        .json({ message: "Viewers cannot update records!" });

    let record = await financialRecordModel.findById(recordId);
    if (!record) return res.status(404).json("Record not found!");

    if (user.role == "analyst") {
      if (record.userId.toString() != user.id)
        return res
          .status(403)
          .json({ message: "Invalid! you can only update your records" });
    }

    let updatedRecord = await financialRecordModel.findByIdAndUpdate(
      recordId,
      {
        amount: data.amount,
        type: data.type,
        category: data.category,
        notes: data.notes,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "record updated successfully!",
      newRecord: updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteRecords = async (req, res) => {
  const recordId = req.params.id;
  const user = req.user;

  try {
    if (user.role == "viewer")
      return res
        .status(403)
        .json({ message: "Viewers cannot delete records!" });

    let record = await financialRecordModel.findById(recordId);
    if (!record) return res.status(404).json("Record not found!");

    if (user.role == "analyst") {
      if (record.userId.toString() != user.id)
        return res
          .status(403)
          .json({ message: "Invalid! you can only delete your records" });
    }

    await financialRecordModel.findByIdAndDelete(recordId);

    return res.status(200).json({
      message: "record deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

