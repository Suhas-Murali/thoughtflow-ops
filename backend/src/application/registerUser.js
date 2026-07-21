const bcrypt = require('bcryptjs');
const prisma = require('../infrastructure/prismaClient');

const SALT_ROUNDS = 10;

/**
 * Registers a new user: hashes their password and stores them in the database.
 * Throws an error if the email is already taken.
 */
async function registerUser({ email, password, role }) {
  const existingUser = await prisma.systemUser.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.systemUser.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'QA_LEAD',
    },
  });

  // Never return the password hash to the caller, even hashed.
  const { password: _omit, ...safeUser } = user;
  return safeUser;
}

module.exports = { registerUser };