import { Context } from "./../index";

interface UserParent {
  id: number;
}
export const User = {
  posts: ({ id }: UserParent, _args: any, { db, userInfo }: Context) => {
    const isOwnProfile = id === Number(userInfo?.userId);
    return db.post.findMany({
      where: { authorId: id, published: isOwnProfile ? undefined : true },
      orderBy: { createdAt: "desc" },
    });
  },
};
