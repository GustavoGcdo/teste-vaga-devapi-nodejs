import mongoose from 'mongoose';

export function getRamdomValidEmail() {
  const randomNumber = Math.floor((Math.random() * 100) + 1);
  return `user${randomNumber}@email.com`;
}

export async function deleteUser(id: string) {
  const objcID = mongoose.Types.ObjectId(id);
  await mongoose.connection.collection('users').findOneAndDelete({ _id: objcID });
}
