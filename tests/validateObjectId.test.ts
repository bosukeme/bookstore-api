import { Request, Response, NextFunction } from 'express';
import { validateObjectId } from '../src/middlewares/validateObjectId';
import mongoose from 'mongoose';

describe('validateObjectId middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if ObjectId is invalid', () => {
    req.params!['id'] = 'invalid-id';
    const middleware = validateObjectId('id');

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid id (Object Id) format',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if ObjectId is valid', () => {
    const validObjectId = new mongoose.Types.ObjectId().toHexString();
    req.params!['id'] = validObjectId;
    const middleware = validateObjectId('id');

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
