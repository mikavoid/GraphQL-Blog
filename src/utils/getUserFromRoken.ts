import * as JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../resolvers/keys";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, JWT_SIGNATURE) as { userId: string } | null;
  } catch (e) {
    return null;
  }
};
