import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  description: string;
  isDone: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true }, // Keep 'taskName' for internal or display purposes
  title: { type: String, required: true }, // Use 'title' for descriptive label
  description: { type: String, required: true },
  isFinished: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  priority: { type: Number, required: true, min: 1, max: 5 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
