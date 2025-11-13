const express = require('express');
const router = express.Router();

const { getCafes, createCafe, updateCafe, deleteCafe } = require('../controllers/cafes');

router.get('/', getCafes);
router.post('/', createCafe);
router.put('/:id', updateCafe);
router.delete('/:id', deleteCafe);

module.exports = router;
