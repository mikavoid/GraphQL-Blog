import { Context } from "./../index";

interface PostParent {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}
export const Post = {
  author: ({ authorId }: PostParent, _args: any, { db }: Context) => {
    return db.user.findUnique({ where: { id: authorId } });
  },
};
