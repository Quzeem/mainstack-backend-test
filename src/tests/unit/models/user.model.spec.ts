// @ts-nocheck
import * as bcrypt from 'bcryptjs';
import { User, UserDoc } from '../../../models/user.model';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('User Model', () => {
  let user: UserDoc;

  beforeEach(() => {
    jest.clearAllMocks();
    user = User.build({ email: 'test@test.com', password: 'password123' });
  });

  describe('verifyPassword', () => {
    it('should return true if password is valid', async () => {
      bcrypt.compare.mockResolvedValue(true);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.verifyPassword('password123');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(result).toBe(true);
    });

    it('should return false if password is invalid', async () => {
      bcrypt.compare.mockResolvedValue(false);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.verifyPassword('wrongPassword');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', user.password);
      expect(result).toBe(false);
    });
  });
});
