import mongoose, {Schema, Document} from "mongoose";

export interface ClientDocument extends Document {
  name: string;
  formatDocument: string;
}

const clientSchema = new Schema<ClientDocument>({
  name: {type: String, required: true, unique: true},
  formatDocument: {type: String, required: true},
});

export default mongoose.model<ClientDocument>("Client", clientSchema);
