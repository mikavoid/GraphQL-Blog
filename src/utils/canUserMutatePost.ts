import { Post } from "@prisma/client";
import { Context } from "..";

export const canUserMutatePost = async (
  userId: string,
  postId: string,
  db: Context["db"]
) => {
  try {
    const user = await db.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return {
        userErrors: [{ message: "user not found" }],
        post: null,
      };
    }
    const post = await db.post.findUnique({ where: { id: Number(postId) } });
    if (post?.authorId !== user.id) {
      return {
        userErrors: [{ message: "access refused" }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post,
    };
  } catch (e) {}
};
