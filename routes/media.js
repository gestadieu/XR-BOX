const express = require('express')
const router = express.Router()

const mediaControllers = require('../controllers/mediaControllers')

router.get('/', mediaControllers.index)
router.post('/', mediaControllers.insert)
router.put('/:id', mediaControllers.update)
router.delete('/:id', mediaControllers.delete)

module.exports = router