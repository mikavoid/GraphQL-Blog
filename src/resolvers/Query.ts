import { getUserFromToken } from "./../utils/getUserFromRoken";
import { Post } from "@prisma/client";
import { Context } from "./../index";

export const Query = {
  posts: (_parent: any, _args: any, { db }: Context): Promise<Post[]> => {
    return db.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
  me: async (_parent: any, _args: any, { db, userInfo }: Context) => {
    if (!userInfo) return null;
    return db.user.findUnique({ where: { id: Number(userInfo.userId) } });
  },
  profile: (
    _parent: any,
    { userId }: { userId: string },
    { db, userInfo }: Context
  ) => {
    if (!userInfo) return null;
    return db.profile.findUnique({
      where: { userId: Number(userInfo.userId) },
    });
  },
};
