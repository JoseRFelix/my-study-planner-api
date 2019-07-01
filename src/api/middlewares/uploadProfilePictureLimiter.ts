import * as rateLimit from 'express-rate-limit';

const uploadProfilePictureLimiter = new rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  handler: () => {
    throw new Error('Too many pictures uploaded, please try again after an hour');
  },
});

export default uploadProfilePictureLimiter;
