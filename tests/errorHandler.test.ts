import { errorHandler, IAppError } from '../src/middlewares/errorHandler'; 
import { Request, Response, NextFunction } from 'express';


describe('errorHandler middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should respond with custom status and message if provided', () => {
    const error: IAppError = {
      name: 'CustomError',
      message: 'Something broke',
      status: 400,
    };

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Something broke' });
  });

  it('should respond with status 500 and default message if not provided', () => {
    const error: IAppError = new Error() as IAppError;

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
