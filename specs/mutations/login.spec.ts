import userResolvers from "@/graphql/resolvers/authResolvers";
import User from "@/pages/api/user"; // Mocking the User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock User model
jest.mock("@/pages/api/user");
jest.mock("jsonwebtoken");

// Ensure JWT_SECRET is set for tests
beforeAll(() => {
	process.env.JWT_SECRET = "fake-jwt-secret"; // Mock the JWT_SECRET here
});

// Mock bcrypt's default compare function
jest.mock("bcryptjs", () => ({
	compare: jest.fn(),
}));

describe("login Mutation", () => {
	let mockUser: any;

	beforeEach(() => {
		mockUser = {
			_id: "user123",
			email: "test@example.com",
			password: "hashedPassword", // Assume a hashed password is stored
		};

		// Mock User.findOne to return the mockUser
		(User.findOne as jest.Mock).mockResolvedValue(mockUser);

		// Mock bcrypt.compare to return true for valid password comparison
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);

		// Mock jwt.sign to return a token
		(jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should throw an error if user is not found", async () => {
		// Mocking User.findOne to return null (invalid email)
		(User.findOne as jest.Mock).mockResolvedValueOnce(null);

		const input = { email: "invalid@example.com", password: "password123" };

		await expect(userResolvers.Mutation.login(null, input)).rejects.toThrow(
			"Invalid credentials"
		);
	});

	it("should throw an error if password is incorrect", async () => {
		// Mocking bcrypt.compare to return false for an incorrect password
		(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

		const input = { email: "test@example.com", password: "wrongPassword" };

		await expect(userResolvers.Mutation.login(null, input)).rejects.toThrow(
			"Invalid credentials"
		);
	});

	it("should return token and user if login is successful", async () => {
		const input = { email: "test@example.com", password: "correctPassword" };

		// Mock bcrypt.compare to return true for the correct password
		(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

		const result = await userResolvers.Mutation.login(null, input);

		expect(result).toEqual({
			token: "fake-jwt-token",
			user: mockUser,
		});
		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId: mockUser._id },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);
	});
});
