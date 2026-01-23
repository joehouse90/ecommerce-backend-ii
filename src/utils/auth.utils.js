import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createHash = (plain) =>
  bcrypt.hashSync(plain, bcrypt.genSaltSync(SALT_ROUNDS));

export const isValidPassword = (plain, hash) =>
  bcrypt.compareSync(plain, hash);
