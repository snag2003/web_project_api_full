const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get(
  "/",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
          )
          .required(),
      })
      .options({ allowUnknown: true }),
  }),
  getAllUsers
);

router.get(
  "/:id",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    params: Joi.object().keys({
      // id: Joi.string().alphanum().required(),
      // id: Joi.string().length(24).hex().required(),
      id: Joi.string()
        .regex(/^[A-Fa-f0-9]*/)
        .required(),
    }),
  }),
  getUserById
);

router.patch(
  "/me",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  "/me/avatar",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(
            /^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
          )
          .required(),
      })
      .options({ allowUnknown: true }),
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        // eslint-disable-next-line no-useless-escape
        .pattern(
          /^(http:\/\/|https:\/\/)(w{3}\.)?([\w\-\/\(\):;,\?]+\.{1}?[\w\-\/\(\):;,\?]+)+#?$/
        ),
      // .uri({ scheme: ['http', 'https'] }),
    }),
  }),
  updateAvatar
);

module.exports = router;
