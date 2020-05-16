import {Request, Response, NextFunction} from 'express'

export default function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isUnauthenticated()) {
    const error = new Error('Unauthorized')
    error['status'] = 401
    throw error
  }

  next()
}
