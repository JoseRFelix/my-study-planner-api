import {Joi} from 'celebrate'

export const homeworkDTOJoi = {
  subject: Joi.string().required(),
  urgency: Joi.string().valid('chill', 'normal', 'important').required(),
  description: Joi.string().allow(null, ''),
  date: Joi.date().required(),
}

export const homeworkJoi = {
  _id: Joi.string().required(),
  subject: Joi.string().required(),
  urgency: Joi.string().valid('chill', 'normal', 'important').required(),
  description: Joi.string().allow(null, ''),
  date: Joi.date().required(),
  done: Joi.boolean().default(false),
  createdBy: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    picture: Joi.string(),
  }),
}
