const express = require('express');
const {addRecord, updateRecords, deleteRecords, viewRecords, filterRecords} = require('../controllers/records.controller');
const {authMiddleware} = require('../middlewares/auth.middleware')

const router = express.Router();

router.post('/',authMiddleware, addRecord);
router.get('/', authMiddleware,viewRecords);
router.put('/:id', authMiddleware, updateRecords);
router.delete('/:id', authMiddleware, deleteRecords);
router.get('/filter', authMiddleware, filterRecords);

module.exports = router;