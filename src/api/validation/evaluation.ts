import {Joi} from 'celebrate'

export const evaluationDTOJoi = {
  subject: Joi.string().required(),
  evaluationType: Joi.string().valid('quiz', 'test').required(),
  urgency: Joi.string().valid('chill', 'normal', 'important').required(),
  description: Joi.string().allow(null, ''),
  date: Joi.date().required(),
}

export const evaluationJoi = {
  _id: Joi.string().required(),
  subject: Joi.string().required(),
  evaluationType: Joi.string().valid('quiz', 'test').required(),
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
