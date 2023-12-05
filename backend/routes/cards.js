const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/,
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required(),
      likes: Joi.array().items(Joi.string()),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/:cardId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/,
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    params: Joi.object().keys({ id: Joi.string().length(24).hex().required() }),
  }),
  deleteCard,
);

cardRouter.put(
  '/likes/:cardId/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/,
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    params: Joi.object().keys({ id: Joi.string().length(24).hex().required() }),
  }),
  likeCard,
);

cardRouter.delete(
  '/likes/:cardId/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/,
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    params: Joi.object().keys({ id: Joi.string().length(24).hex().required() }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
