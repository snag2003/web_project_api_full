const Card = require("../models/cards");

const AuthError = require("../errors/auth-err");
const BadRequestError = require("../errors/bad-request-err");
const InternalServerError = require("../errors/internal-server-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      throw new InternalServerError("Un error ha ocurrido en el servidor");
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("No se ha podido crear la tarjeta");
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card && req.user._id.toString() === card.owner.toString()) {
        Card.deleteOne(card).then((deletedCard) => {
          res.send(deletedCard);
        });
      } else if (!card) {
        throw new NotFoundError("Tarjeta no encontrada.");
      } else {
        throw new AuthError(
          "Necesitas ser el dueño de esta tarjeta para poder eliminarla"
        );
      }
    })
    .catch((err) => {
      if (err.name === "CastError" || err.statusCode === 404) {
        throw new NotFoundError("Tarjeta no encontrada.");
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else if (!card) {
        throw new NotFoundError("Tarjeta no encontrada");
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        throw new NotFoundError("Tarjeta no encontrada");
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else if (!card) {
        throw new NotFoundError("Tarjeta no encontrada");
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        throw new NotFoundError("Tarjeta no encontrada");
      }
    })
    .catch(next);
};
