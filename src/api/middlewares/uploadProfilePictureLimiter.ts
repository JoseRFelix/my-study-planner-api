import * as rateLimit from 'express-rate-limit';

const uploadProfilePictureLimiter = new rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message: 'Too many accounts created from this IP, please try again after an hour',
});

export default uploadProfilePictureLimiter;
