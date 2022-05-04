import { postResolvers } from "./Post";
import { userResolvers } from "./User";

export const Mutation = {
  ...postResolvers,
  ...userResolvers,
};
