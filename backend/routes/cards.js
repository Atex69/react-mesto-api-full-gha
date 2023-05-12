const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:id', validationCardId, deleteCard);
router.put('/likes/:id', validationCardId, likeCard);
router.delete('/likes/:id', validationCardId, dislikeCard);

module.exports = router;
