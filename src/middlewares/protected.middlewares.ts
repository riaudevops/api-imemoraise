import { Request, Response, NextFunction } from "express";

// Extend Request type to include 'role'
interface CustomRequest extends Request {
  roles?: string[];
}

const authorizeRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const userRole = (req as CustomRequest).roles;
    const hasRole = userRole?.some((role) => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};

export { authorizeRoles };
