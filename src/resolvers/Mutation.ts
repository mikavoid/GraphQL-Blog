import { Post } from "@prisma/client";
import { Context } from "./../index";

interface PostCreateArgs {
  input: {
    title: string;
    content: string;
  };
}

interface PostUpdateArgs extends Partial<PostCreateArgs> {
  id: string;
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _parent: any,
    { input: { title, content } }: PostCreateArgs,
    { db }: Context
  ): Promise<PostPayloadType> => {
    let post = null;
    const userErrors: { message: string }[] = [];

    if (!title || !content) {
      return {
        userErrors: [
          { message: "You must provide a content and title to make a post" },
        ],
        post: null,
      };
    }

    try {
      post = await db.post.create({
        data: {
          title,
          content,
          authorId: 1,
        },
      });
    } catch (e) {
      userErrors.push({ message: e?.message });
    }

    return {
      userErrors,
      post,
    };
  },

  postUpdate: async (
    _parent,
    { id, input: { title, content } }: PostUpdateArgs,
    { db }: Context
  ): Promise<PostPayloadType> => {
    if (!id) {
      return {
        userErrors: [
          { message: "You must provide a post id to update a post" },
        ],
        post: null,
      };
    }

    const existingPost = await db.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    const post = await db.post.update({
      data: { title, content },
      where: { id: Number(id) },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postDelete: async (
    _parent: any,
    { id }: { id: string },
    { db }: Context
  ): Promise<PostPayloadType> => {
    if (!id) {
      return {
        post: null,
        userErrors: [{ message: "You must profide an id to delete a post" }],
      };
    }

    const post = await db.post.delete({ where: { id: Number(id) } });
    return {
      post,
      userErrors: [],
    };
  },
};
