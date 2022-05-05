import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Profile, User, Post, Mutation } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromRoken";

const PORT = 4001;

export interface Context {
  db: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;
  userInfo: {
    userId: string;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Profile,
    Post,
    User,
    Mutation,
  },
  context: ({ req }) => ({
    db: new PrismaClient(),
    userInfo: getUserFromToken(req.headers.authorization),
  }),
});

server.listen(PORT).then(() => {
  console.log(`Server is listening on port ${PORT}`);
});
