// routes/habitRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const hc = require('../controllers/habitController');
const hlc = require('../controllers/habitLogController');

const router = express.Router();
// router.use(auth);                                     // all need token

router.route('/').get(auth, hc.getHabits).post(auth, hc.createHabit);

router.route('/incomplete').get(auth, hc.getHabitIncomplete);

router.route('/:id').put(hc.updateHabit).delete(hc.deleteHabit);

router.post('/:id/logs', auth, hlc.addLogToday);
router.get('/:id/logs', auth, hlc.getLogs);
router.delete('/:habitId/logs/:logId', hlc.deleteLog);

module.exports = router;
