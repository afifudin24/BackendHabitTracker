// routes/habitRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const hc = require('../controllers/habitController');
const hlc = require('../controllers/habitLogController');

const router = express.Router();
// router.use(auth);                                     // all need token

router.route('/')
  .get(hc.getHabits)
  .post(hc.createHabit);

router.route('/:id')
  .put(hc.updateHabit)
  .delete(hc.deleteHabit);

router.post('/:id/logs', hlc.addLogToday);
router.get('/:id/logs',  hlc.getLogs);
router.delete('/:habitId/logs/:logId', hlc.deleteLog);

module.exports = router;
