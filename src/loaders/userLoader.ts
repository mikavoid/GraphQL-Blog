import { User } from "@prisma/client";
import * as Dataloader from "dataloader";
import { db } from "..";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids) => {
  const users = await db.user.findMany({
    where: {
      id: { in: ids },
    },
  });

  const userMap: Record<string, User> = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

export const userLoader = new Dataloader<number, User>(batchUsers as any);
