import { UserDoc } from '../../models/user.model';

// To make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserDoc;
    }
  }
}
