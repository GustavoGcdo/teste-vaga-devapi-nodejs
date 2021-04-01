import mongoose from 'mongoose';

export async function deleteUser(id: string) {
  const objcID = mongoose.Types.ObjectId(id);
  await mongoose.connection.collection('users').findOneAndDelete({ _id: objcID });
}
