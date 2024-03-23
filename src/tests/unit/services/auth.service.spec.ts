import httpError from 'http-errors';
import { signUp, login } from './../../../services/auth.service';
import User, { UserAttrs } from '../../../models/user.model';

jest.mock('../../../helpers/jwt', () => ({
  generateJwtToken: jest.fn().mockReturnValue('token'),
}));

describe('Auth Service', () => {
  describe('signUp', () => {
    it('should create a new user', async () => {
      const user: UserAttrs = { email: 'test@example.com', password: 'password123' };

      const mockSave = jest.fn();
      const mockBuild = jest.fn().mockReturnValue({ save: mockSave });
      User.build = mockBuild;

      await signUp(user);

      expect(mockBuild).toHaveBeenCalledWith(user);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'password123',
        verifyPassword: jest.fn(),
      };

      // const mockFindOne = jest.fn().mockResolvedValue(user); // Without .select() attached
      // Mocking the findOne method to return a user object with exec method and select
      const mockFindOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(), // Mocking the select method to return the mock query object itself
        exec: jest.fn().mockResolvedValue(user), // Resolve with user, indicating user was found
      });
      User.findOne = mockFindOne;
      user.verifyPassword.mockResolvedValue(true); // Indicate correct password

      const loginData: UserAttrs = {
        email: 'test@example.com',
        password: 'password123',
      };

      const token = await login(loginData);

      expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(user.verifyPassword).toHaveBeenCalledWith(loginData.password);
      expect(token).toBe('token');
    });

    it('should throw an unauthorized error when the user is not found', async () => {
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'password123',
        verifyPassword: jest.fn(),
      };

      const loginData: UserAttrs = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mocking the findOne method to return a null object with exec method and select
      const mockFindOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(), // Mocking the select method to return the mock query object itself
        exec: jest.fn().mockResolvedValue(null), // Resolve with null, indicating user was not found
      });
      User.findOne = mockFindOne;
      user.verifyPassword.mockResolvedValue(true); // Indicate correct password

      await expect(login(loginData)).rejects.toThrow(httpError.Unauthorized);
      expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
    });

    it('should throw an unauthorized error when the password is incorrect', async () => {
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'password123',
        verifyPassword: jest.fn(),
      };

      const loginData: UserAttrs = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mocking the findOne method to return a user object with exec method and select
      const mockFindOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(), // Mocking the select method to return the mock query object itself
        exec: jest.fn().mockResolvedValue(user), // Resolve with user, indicating user was found
      });
      User.findOne = mockFindOne;
      user.verifyPassword.mockResolvedValue(false); // Indicate incorrect password

      await expect(login(loginData)).rejects.toThrow(httpError.Unauthorized);
      expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(user.verifyPassword).toHaveBeenCalledWith(loginData.password);
    });
  });
});

// WITHOUT SELECT AND EXEC METHOD ATTACHED TO A QUERY
// USER MODEL - e.g password: {type: String. required: true}
// FIND_ONE QUERY - e.g const user = await User.findOne({ email });
// describe('Auth Service', () => {
//   describe('signUp', () => {
//     it('should create a new user', async () => {
//       const user: UserAttrs = { email: 'test@example.com', password: 'password123' };

//       const mockSave = jest.fn();
//       const mockBuild = jest.fn().mockReturnValue({ save: mockSave });
//       User.build = mockBuild;

//       await signUp(user);

//       expect(mockBuild).toHaveBeenCalledWith(user);
//       expect(mockSave).toHaveBeenCalled();
//     });
//   });

//   describe('login', () => {
//     it('should return a JWT token for valid credentials', async () => {
//       const user = User.build({ email: 'test@test.com', password: 'password123' });

//       const mockVerifyPassword = jest.fn().mockResolvedValue(true);
//       user.verifyPassword = mockVerifyPassword;

//       const mockFindOne = jest.fn().mockResolvedValue(user); // Without .select() attached
//       User.findOne = mockFindOne;

//       const loginData: UserAttrs = {
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       const token = await login(loginData);

//       expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
//       expect(mockVerifyPassword).toHaveBeenCalledWith(loginData.password);
//       expect(token).toBe('token');
//     });

//     it('should throw an unauthorized error when the user is not found', async () => {
//       const loginData: UserAttrs = {
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       const mockFindOne = jest.fn().mockResolvedValue(null); // User not found
//       User.findOne = mockFindOne;

//       await expect(login(loginData)).rejects.toThrow(httpError.Unauthorized);
//       expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
//     });

//     it('should throw an unauthorized error when the password is incorrect', async () => {
//       const user = User.build({ email: 'test@test.com', password: 'password123' });

//       const mockVerifyPassword = jest.fn().mockResolvedValue(false); // Incorrect password
//       user.verifyPassword = mockVerifyPassword;

//       const loginData: UserAttrs = {
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       const mockFindOne = jest.fn().mockResolvedValue(user);
//       User.findOne = mockFindOne;

//       await expect(login(loginData)).rejects.toThrow(httpError.Unauthorized);
//       expect(mockFindOne).toHaveBeenCalledWith({ email: loginData.email });
//       expect(mockVerifyPassword).toHaveBeenCalledWith(loginData.password);
//     });
//   });
// });
