import { Request, Response, NextFunction } from "express";

// Extend Request type to include 'role'
interface CustomRequest extends Request {
    roles?: string[];
}

const mahasiswaOnly = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if ((req as CustomRequest).roles?.includes("mahasiswa")) {
        return next();
    }  

    res.status(401).json({
      response: false,
      message: "Unauthorized",
    });
};

const dosenPaOnly = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if ((req as CustomRequest).roles?.includes("dosen-pa")) {
        return next();
    }  

    res.status(401).json({
      response: false,
      message: "Unauthorized",
    });
};

export {
    mahasiswaOnly,
    dosenPaOnly
}