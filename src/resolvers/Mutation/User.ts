import * as bcrypt from "bcryptjs";
import validator from "validator";
import * as JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { Context } from "../..";
import { JWT_SIGNATURE } from "../keys";

interface SignUpArgs {
  credentials: {
    email: string;
    name: string;
    bio: string;
    password: string;
  };
}

interface AuthPayloadType {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const userResolvers = {
  signup: async (
    _parent: any,
    { credentials: { email, password, name, bio } }: SignUpArgs,
    { db }: Context
  ): Promise<AuthPayloadType> => {
    const userErrors = [];
    let token = null;
    // Validate inputs

    if (!validator.isEmail(email)) {
      userErrors.push({ message: "Email is invalid" });
    }

    if (!validator.isLength(password, { min: 5 })) {
      userErrors.push({ message: "Password is too short" });
    }

    if (!name || !bio) {
      userErrors.push({ message: "Name and bio are mandatory fields" });
    }

    if (!userErrors.length) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
          data: { email, password: hashedPassword, name },
        });
        await db.profile.create({
          data: { bio, userId: user.id },
        });

        token = JWT.sign(
          {
            userId: user.id,
          },
          JWT_SIGNATURE,
          {
            expiresIn: 3600000,
          }
        );
      } catch (e) {
        userErrors.push({ message: "An error occured" });
      }
    }

    return {
      userErrors,
      token,
    };
  },

  signin: async (
    _parent: any,
    { credentials: { email, password } }: SignUpArgs,
    { db }: Context
  ): Promise<AuthPayloadType> => {
    const userErrors = [];
    let token = null;
    const foundUser = await db.user.findUnique({ where: { email } });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      userErrors.push({ message: "Invalid credentials" });
    }

    if (!userErrors?.length) {
      token = JWT.sign(
        {
          userId: foundUser.id,
        },
        JWT_SIGNATURE,
        {
          expiresIn: 3600000,
        }
      );
    }

    return {
      userErrors,
      token,
    };
  },
};
