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
};
