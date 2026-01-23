import jwt from "jsonwebtoken";

export const signToken = (payload, secret, expiresIn = "1d") =>
  jwt.sign(payload, secret, { expiresIn });
