import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request type to include 'role'
interface CustomRequest extends Request {
  roles?: string[];
}

const accessTokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      response: false,
      message: "Token is required",
    });
  }

  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    process.env.PUBLIC_KEY +
    "\n-----END PUBLIC KEY-----";

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Type assertion to make sure 'decoded' is treated as JwtPayload
    const jwtPayload = decoded as JwtPayload;

    // Extract roles from the decoded token
    const roles = jwtPayload.resource_access?.iMemoraise?.roles;

    (req as CustomRequest).roles = roles;
    next();
  });
};

export default accessTokenValidation;
