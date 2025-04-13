import User from "@/pages/api/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fake-jwt-secret";
if (!JWT_SECRET && process.env.NODE_ENV !== "test") {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const userResolvers = {
  Mutation: {
    signup: async (
      _: any,
      {
        username,
        email,
        password,
      }: { username: any; email: any; password: any }
    ) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already in use");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    login: async (
      _: any,
      { email, password }: { email: any; password: any }
    ) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },
  },
};

export default userResolvers;
