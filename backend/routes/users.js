const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get(
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
  }),
  getUsers,
);

userRouter.get(
  '/:id',
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
    params: Joi.object().keys({
      id: Joi.alternatives()
        .try(Joi.string().length(24).hex(), Joi.string().regex(/^me$/))
        .required(),
    }),
  }),
  getUserById,
);

userRouter.patch(
  '/me',
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
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile,
);

userRouter.patch(
  '/me/avatar',
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
      avatar: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required(),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
