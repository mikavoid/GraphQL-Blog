import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    profile(userId: ID): Profile
    posts: [Post!]!
  }

  type Mutation {
    postCreate(input: PostInput): PostPayload!
    postUpdate(id: ID, input: PostInput): PostPayload!
    postDelete(id: ID): PostPayload!
    postPublish(id: ID!): PostPayload!
    postUnpublish(id: ID!): PostPayload!
    signup(credentials: CredentialsInput): AuthPayload!
    signin(credentials: CredentialsInput): AuthPayload!
  }

  input CredentialsInput {
    email: String!
    password: String!
    name: String
    bio: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String
    content: String
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
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
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User
  }
`;
