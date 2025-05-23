// controllers/habitController.js
const { Habit, HabitLog } = require('../models');
const Sequelize = require('sequelize');
// Jadi ini:
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isoWeek = require('dayjs/plugin/isoWeek');
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek); // agar s

/**
 * GET /api/habits
 * List all habits that belong to the signed‑in user.
 */
exports.getHabits = async (req, res, next) => {
  console.log(req.user);
  try {
    const habits = await Habit.findAll({
      where: { userId: req.user.id },
      include: [{ model: HabitLog, as: 'logs' }],
      order: [['createdAt', 'ASC']],
    });
    res.json(habits);
  } catch (e) {
    next(e);
  }
};

exports.getHabitIncomplete = async (req, res, next) => {
  const userId = req.user.id;

  const habits = await Habit.findAll({
    where: {
      userId,
      archived: false,
    },
    include: [
      {
        model: HabitLog,
        as: 'logs',
      },
    ],
  });

  const today = dayjs().startOf('day');
  const startOfWeek = today.startOf('isoWeek');
  const endOfWeek = today.endOf('isoWeek');
  const startOfMonth = today.startOf('month');
  const endOfMonth = today.endOf('month');

  const incompleteHabits = habits.filter((habit) => {
    const logs = habit.logs || [];

    const today = dayjs().startOf('day');
    const startOfWeek = today.startOf('isoWeek');
    const endOfWeek = today.endOf('isoWeek');
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');

    let relevantLogs = [];

    if (habit.periodType === 'daily') {
      // Ambil log hari ini
      relevantLogs = logs.filter((log) => dayjs(log.date).isSame(today, 'day'));
      // Daily selalu tampilkan (user bisa check ulang hari ini)
      return true;
    } else if (habit.periodType === 'weekly') {
      // Ambil log minggu ini
      relevantLogs = logs.filter((log) =>
        dayjs(log.date).isBetween(startOfWeek, endOfWeek, null, '[]'),
      );

      // Cek log value=1 yang bukan di hari ini
      const hasCheckedOtherDayThisWeek = relevantLogs.some(
        (log) => log.value === 1 && !dayjs(log.date).isSame(today, 'day'),
      );

      // Kalau sudah ada log value=1 di minggu ini di hari selain hari ini, jangan tampilkan
      return !hasCheckedOtherDayThisWeek;
    } else if (habit.periodType === 'monthly') {
      // Ambil log bulan ini
      relevantLogs = logs.filter((log) =>
        dayjs(log.date).isBetween(startOfMonth, endOfMonth, null, '[]'),
      );

      // Cek log value=1 yang bukan di hari ini
      const hasCheckedOtherDayThisMonth = relevantLogs.some(
        (log) => log.value === 1 && !dayjs(log.date).isSame(today, 'day'),
      );

      // Kalau sudah ada log value=1 di bulan ini di hari selain hari ini, jangan tampilkan
      return !hasCheckedOtherDayThisMonth;
    }

    // Default tampilkan
    return true;
  });

  res.json(incompleteHabits);
};

/**
 * POST /api/habits
 * Create a new habit for the signed‑in user.
 */
exports.createHabit = async (req, res, next) => {
  console.log(req.body);
  const id = uuidv4();
  try {
    const { title, description, periodType, targetValue, colorHex } = req.body;

    const habit = await Habit.create({
      userId: req.user.id,
      id: id,
      // userId,
      title,
      description,
      periodType,
      targetValue,
      colorHex,
    });

    res.status(201).json({
      status: 'Success',
      message: 'Data Successfully Added',
      data: habit,
    });
  } catch (e) {
    // Handle Sequelize validation errors
    console.error(e);
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: e.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create habit',
      error: e.message,
    });

    // next(e);
  }
};

/**
 * PATCH /api/habits/:id
 * Update a habit (only owner can do this).
 */
exports.updateHabit = async (req, res, next) => {
  console.log('body', req.body);
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
    fields.forEach((f) => {
      if (req.body[f] !== undefined) habit[f] = req.body[f];
    });

    const update = await habit.save();
    console.log(update);
    res.status(200).json({
      status: 'Success',
      message: 'Data Successfully Updated',
      data: habit,
    });
  } catch (e) {
    next(e);
  }
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

    res.json({
      status: 'Success',
      message: 'Data Successfully Deleted',

      data: req.params.id,
    });
  } catch (e) {
    next(e);
  }
};
