import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  isFinished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, required: true, min: 1, max: 5 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: String, required: true },
});

export default mongoose.model("Task", taskSchema);
