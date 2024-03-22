import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Describes what properties are required to create a user
export interface UserAttrs {
  email: string;
  password: string;
}

// Describes what properties and methods a user document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  verifyPassword(this: UserDoc, password: string): Promise<boolean>;
}

// Describes what properties and methods a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

// Hash plain text password
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// Password verification
UserSchema.methods.verifyPassword = async function (this: UserDoc, password: string) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);
export default User;
