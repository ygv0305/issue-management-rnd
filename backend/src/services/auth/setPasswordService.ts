// Models
import User from '../../models/userSchema.js';
import VerificationToken from '../../models/verificationTokenSchema.js';

export const verifyToken = async (email: string, token: string) => {
  return await VerificationToken.findOne({ email, token });
};

export const createUser = async (email: string, password: any) => {
  return await User.create({ email, password });
};

export const updatePassword = async (email: string, password: any) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  user.password = password;
  await user.save();
  return user;
};

export const deleteToken = async (tokenId: any) => {
  await VerificationToken.deleteOne({ _id: tokenId });
};
