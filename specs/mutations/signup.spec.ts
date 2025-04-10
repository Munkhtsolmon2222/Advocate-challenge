process.env.JWT_SECRET = "test-secret";
import userResolvers from "@/graphql/resolvers/authResolvers";
import User from "@/pages/api/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
jest.mock("@/pages/api/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("signup Mutation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should throw an error if email is already in use", async () => {
		(User.findOne as jest.Mock).mockResolvedValue({
			email: "test@example.com",
		});

		await expect(
			userResolvers.Mutation.signup(null, {
				username: "test",
				email: "test@example.com",
				password: "password123",
			})
		).rejects.toThrow("Email already in use");
	});

	it("should create a user and return token", async () => {
		const mockUser = {
			_id: "user123",
			username: "test",
			email: "test@example.com",
			password: "hashedPassword",
		};

		(User.findOne as jest.Mock).mockResolvedValue(null);
		(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
		(User.create as jest.Mock).mockResolvedValue(mockUser);
		(jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

		const result = await userResolvers.Mutation.signup(null, {
			username: "test",
			email: "test@example.com",
			password: "password123",
		});

		expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
		expect(User.create).toHaveBeenCalledWith({
			username: "test",
			email: "test@example.com",
			password: "hashedPassword",
		});
		expect(jwt.sign).toHaveBeenCalledWith({ userId: "user123" }, JWT_SECRET, {
			expiresIn: "7d",
		});
		expect(result).toEqual({
			token: "mocked-jwt-token",
			user: mockUser,
		});
	});
});
