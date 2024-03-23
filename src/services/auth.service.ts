import httpError from 'http-errors';

import User, { UserAttrs } from '../models/user.model';
import { generateJwtToken } from '../helpers/jwt';

export const signUp = async (data: UserAttrs): Promise<void> => {
  const user = User.build(data);
  await user.save();
};

export const login = async (data: UserAttrs): Promise<string> => {
  const { email, password } = data;

  // For testing, exec is important when select is attached
  const user = await User.findOne({ email }).select('+password').exec();
  if (!user || !(await user.verifyPassword(password))) {
    throw new httpError.Unauthorized('Invalid credentials');
  }

  return generateJwtToken({ userId: user.id });
};
