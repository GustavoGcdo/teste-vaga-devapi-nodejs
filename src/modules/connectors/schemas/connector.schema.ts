import { model, Schema } from 'mongoose';

const schema = new Schema(
  {
    id: String,
    name: String,
    type: String,
    privacy: String,
    baseURL: String,
    category: String,
    description: String,
    status: Boolean
  },
  {
    timestamps: true
  }
);

export default model('Connector', schema);
