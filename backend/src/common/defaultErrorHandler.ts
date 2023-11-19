import { Response, Request } from "express";

export const defaultErrorHandler =
  (routeHandler: (req: Request, res: Response, next: any) => Promise<any>) =>
  async (req: Request, res: Response, next: any) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send((err as Error)?.message);
    }
  };
