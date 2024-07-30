import { Request, Response, NextFunction, response } from "express";
import jwt from "jsonwebtoken";

const accessTokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
        response: false,
        message: "Token is required" 
    });
  }

  console.log("Received token:", token);

  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    process.env.PUBLIC_KEY +
    "\n-----END PUBLIC KEY-----";

  console.log("Using public key:", publicKey);

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Decoded token:", decoded);
    next();
  });
};

export default accessTokenValidation;
