import {
  ErrorRequestHandler,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

export const asyncErrorCatcher =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e: any) {
      next(e);
    }
  };

export const errorResponser: ErrorRequestHandler = (err, req, res, next) => {
  const { status, message } = err;
  console.log(err);
  res.status(status || 500).json({ message });
};
