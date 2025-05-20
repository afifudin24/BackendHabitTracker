// controllers/userController.js
const { User } = require('../models'); // Mengimpor model User

// Menambahkan User baru
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    return res.status(200).json({
      req: req.user,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat mendapatkan data pengguna' });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, email, passwordString, passwordHash } = req.body;

    const newUser = await User.create({
      name,
      email,
      passwordString, // Harus dipastikan ini terenkripsi sebelumnya
      passwordHash,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat membuat pengguna' });
  }
};

// Mendapatkan semua Users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat mendapatkan data pengguna' });
  }
};

// Mendapatkan User berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat mendapatkan data pengguna' });
  }
};

// Mengupdate data User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, passwordString, passwordHash } = req.body;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.passwordString = passwordString || user.passwordString;
    user.passwordHash = passwordHash || user.passwordHash;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat mengupdate data pengguna' });
  }
};

// Menghapus User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    await user.destroy();

    return res.status(200).json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan saat menghapus pengguna' });
  }
};

module.exports = {
  getMe,
  createUser,
  getUsers,
  getUserById,
  updateUser,
};
