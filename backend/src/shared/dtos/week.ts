import Joi from 'joi';

const timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/;

export const createWeekDto = Joi.object({
  weekId: Joi.string().required()
});
