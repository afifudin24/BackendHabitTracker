// controllers/habitController.js
const { Habit, HabitLog } = require('../models');

/**
 * GET /api/habits
 * List all habits that belong to the signed‑in user.
 */
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.findAll({
      // where: { userId: req.user.id },
      // include: [{ model: HabitLog, as: 'logs' }],
      order: [['createdAt', 'ASC']],
    });
    res.json(habits);
  } catch (e) { next(e); }
};

/**
 * POST /api/habits
 * Create a new habit for the signed‑in user.
 */
exports.createHabit = async (req, res, next) => {
  try {
    const { userId, title, description, periodType, targetValue, colorHex } = req.body;

    const habit = await Habit.create({
      // userId: req.user.id,
       userId,
      title,
      description,
      periodType,
      targetValue,
      colorHex,
    });

    res.status(201).json(habit);
  } catch (e) { next(e); }
};

/**
 * PATCH /api/habits/:id
 * Update a habit (only owner can do this).
 */
exports.updateHabit = async (req, res, next) => {
  try {
    // const habit = await Habit.findOne({
    //   where: { id: req.params.id, userId: req.user.id },
    // });
    const habit = await Habit.findOne({
      where: { id: req.params.id },
    });

    console.log(req.body);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const fields = [
      'title',
      'description',
      'periodType',
      'targetValue',
      'colorHex',
      'archived',
    ];
    console.log(fields);
    fields.forEach(f => { if (req.body[f] !== undefined) habit[f] = req.body[f]; });

   const update =  await habit.save();
   console.log(update);
    res.json(habit);
  } catch (e) { next(e); }
};

/**
 * DELETE /api/habits/:id
 * Hard‑delete the habit & its logs.
 */
exports.deleteHabit = async (req, res, next) => {
  try {
    // const rows = await Habit.destroy({
    //   where: { id: req.params.id, userId: req.user.id },
    // });

     const rows = await Habit.destroy({
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ message: 'Habit not found' });

    res.json({ message: 'Habit deleted' });
  } catch (e) { next(e); }
};
