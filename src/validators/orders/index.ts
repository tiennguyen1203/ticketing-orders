import { mongoose } from '@typegoose/typegoose';
import { body, param } from 'express-validator';

export const createOrderBodyValidator = [
  body('ticketId')
    .isString()
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
];

export const updateTicketBodyValidator = [
  body('title').isString().trim().notEmpty().optional(),
  body('price').isFloat({ gt: 0 }).optional(),
  body('thumbnail').isString().trim().optional(),
];

export const idParam = [
  param('id')
    .isString()
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
];
