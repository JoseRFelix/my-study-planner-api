import * as rateLimit from 'express-rate-limit'
import {Request, Response} from 'express-serve-static-core'

const uploadProfilePictureLimiter = new rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 5 requests
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      errors: {
        message: 'Too many pictures uploaded, please try again after an hour',
      },
    })
  },
})

export default uploadProfilePictureLimiter
