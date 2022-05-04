import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type Mutation {
    postCreate(input: PostInput): PostPayload!
    postUpdate(id: ID, input: PostInput): PostPayload!
    postDelete(id: ID): PostPayload!
  }

  input PostInput {
    title: String
    content: String
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type UserError {
    message: String!
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    author: User!
  }

  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User
  }
`;
