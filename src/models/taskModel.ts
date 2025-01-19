import mongoose, {Schema, Document} from "mongoose";

export interface TaskDocument extends Document {
  clientId: Schema.Types.ObjectId;
  videoUrl: string;
  transcript?: string;
  description?: string;
  chapters?: Array<string>;
  status: string;
  progress: number;
  logs: Array<{message: string; timestamp: Date}>;
}

const taskSchema = new Schema<TaskDocument>({
  clientId: {type: Schema.Types.ObjectId, required: true, ref: "Client"},
  videoUrl: {type: String, required: true},
  transcript: {type: String},
  description: {type: String},
  chapters: {type: [String]},
  status: {type: String, default: "pending"},
  progress: {type: Number, default: 0},
  logs: [
    {
      message: {type: String},
      timestamp: {type: Date, default: Date.now},
    },
  ],
});

export default mongoose.model<TaskDocument>("Task", taskSchema);
