import { Context } from "./../index";

interface ProfileParent {
  id: number;
  bio: string;
  userId: number;
}
export const Profile = {
  user: ({ userId }: ProfileParent, _args: any, { db }: Context) => {
    if (!userId) return null;
    return db.user.findUnique({ where: { id: Number(userId) } });
  },
};
