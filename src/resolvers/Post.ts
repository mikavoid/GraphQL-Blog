import { userLoader } from "./../loaders/userLoader";
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
    return userLoader.load(authorId);
  },
};
