// controllers/habitLogController.js
const { Habit, HabitLog } = require('../models');

/**
 * POST /api/habits/:id/logs
 * Upsert a log for TODAY on the chosen habit.
 * Body: { value, note }
 */
exports.addLogToday = async (req, res, next) => {
  console.log(req.params.id);
  try {
    // Pastikan habit milik user yang sedang login
    const habit = await Habit.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate); // output: "2025-05-23"

    // Cek apakah sudah ada log untuk hari ini
    let log = await HabitLog.findOne({
      where: {
        habitId: habit.id,
        date: formattedDate.toString(),
      },
    });

    console.log(log);

    if (log) {
      // Jika sudah ada, toggle value
      log.value = log.value === 1 ? 0 : 1;

      await log.save();
    } else {
      // Jika belum ada, buat baru
      log = await HabitLog.create({
        habitId: habit.id,
        date: formattedDate,
        value: req.body.value ?? 1,
      });
    }

    res.status(201).json(log);
  } catch (e) {
    next(e);
  }
};

/**
 * GET /api/habits/:id/logs
 * Fetch logs for a habit (optionally between ?from=YYYY‑MM‑DD&to=YYYY‑MM‑DD)
 */
exports.getLogs = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const { from, to } = req.query;
    const where = { habitId: habit.id };
    if (from) where.logDate = { ...where.logDate, $gte: from };
    if (to) where.logDate = { ...where.logDate, $lte: to };

    const logs = await HabitLog.findAll({
      where,
      order: [['logDate', 'ASC']],
    });

    res.json(logs);
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /api/habits/:habitId/logs/:logId
 */
exports.deleteLog = async (req, res, next) => {
  try {
    // ensure habit belongs to user
    const habit = await Habit.findOne({
      where: { id: req.params.habitId, userId: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const rows = await HabitLog.destroy({
      where: { id: req.params.logId, habitId: habit.id },
    });
    if (!rows) return res.status(404).json({ message: 'Log not found' });

    res.json({ message: 'Log deleted' });
  } catch (e) {
    next(e);
  }
};
