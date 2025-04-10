import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}
console.log(JWT_SECRET);
export const authContext = ({ req }: any) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return {};

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId };
  } catch (err) {
    return {};
  }
};
