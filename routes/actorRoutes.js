const express = require('express');
const router = express.Router();
const controller = require('../controllers/actorController');

router.get('/', controller.getAllActors);
router.get('/:id', controller.getActor);
router.post('/', controller.createActor);
router.put('/:id', controller.updateActor);
router.delete('/:id', controller.deleteActor);

module.exports = router;
