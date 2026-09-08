import type {
  NextFunction,
  RequestHandler,
} from 'express';

type AnyAsyncHandler = RequestHandler<
  any,
  any,
  any,
  any,
  any
>;

export const asyncHandler = (
  handler: AnyAsyncHandler,
): RequestHandler<
  any,
  any,
  any,
  any,
  any
> => {
  return (req, res, next: NextFunction) => {
    Promise.resolve(
      handler(req, res, next),
    ).catch(next);
  };
};