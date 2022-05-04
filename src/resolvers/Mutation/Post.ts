import { canUserMutatePost } from "./../../utils/canUserMutatePost";
import { Post } from "@prisma/client";
import { Context } from "../..";

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

export const postResolvers = {
  postCreate: async (
    _parent: any,
    { input: { title, content } }: PostCreateArgs,
    { db, userInfo }: Context
  ): Promise<PostPayloadType> => {
    let post = null;
    const userErrors: { message: string }[] = [];

    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access" }],
        post: null,
      };
    }

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
          authorId: Number(userInfo.userId),
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
    { db, userInfo }: Context
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
    const error = await canUserMutatePost(
      userInfo.userId,
      String(existingPost?.id),
      db
    );

    if (!error?.post) {
      return error;
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
    { db, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!id) {
      return {
        post: null,
        userErrors: [{ message: "You must profide an id to delete a post" }],
      };
    }

    const post = await db.post.delete({ where: { id: Number(id) } });

    const error = await canUserMutatePost(
      userInfo.userId,
      String(post?.id),
      db
    );

    if (!error?.post) {
      return error;
    }

    return {
      post,
      userErrors: [],
    };
  },

  postPublish: async (
    _parent: any,
    { id }: { id: string },
    { db, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!id) {
      return {
        post: null,
        userErrors: [{ message: "You must profide an id to publish a post" }],
      };
    }

    let post = await db.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    const error = await canUserMutatePost(
      userInfo.userId,
      String(post?.id),
      db
    );

    if (!error?.post) {
      return error;
    }

    post = await db.post.update({
      data: {
        published: true,
      },
      where: {
        id: Number(id),
      },
    });

    return {
      post,
      userErrors: [],
    };
  },
  postUnpublish: async (
    _parent: any,
    { id }: { id: string },
    { db, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!id) {
      return {
        post: null,
        userErrors: [{ message: "You must profide an id to publish a post" }],
      };
    }

    let post = await db.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    const error = await canUserMutatePost(
      userInfo.userId,
      String(post?.id),
      db
    );

    if (!error?.post) {
      return error;
    }

    post = await db.post.update({
      data: {
        published: false,
      },
      where: {
        id: Number(id),
      },
    });

    return {
      post,
      userErrors: [],
    };
  },
};
