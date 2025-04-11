import userResolvers from "@/graphql/resolvers/authResolvers";
import User from "@/pages/api/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("@/pages/api/user");
jest.mock("jsonwebtoken");

beforeAll(() => {
	process.env.JWT_SECRET = "fake-jwt-secret";
});

jest.mock("bcryptjs", () => ({
	compare: jest.fn(),
}));

describe("login Mutation", () => {
	let mockUser: any;

	beforeEach(() => {
		mockUser = {
			_id: "user123",
			email: "test@example.com",
			password: "hashedPassword",
		};

		(User.findOne as jest.Mock).mockResolvedValue(mockUser);

		(bcrypt.compare as jest.Mock).mockResolvedValue(true);

		(jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should throw an error if user is not found", async () => {
		(User.findOne as jest.Mock).mockResolvedValueOnce(null);

		const input = { email: "invalid@example.com", password: "password123" };

		await expect(userResolvers.Mutation.login(null, input)).rejects.toThrow(
			"Invalid credentials"
		);
	});

	it("should throw an error if password is incorrect", async () => {
		(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

		const input = { email: "test@example.com", password: "wrongPassword" };

		await expect(userResolvers.Mutation.login(null, input)).rejects.toThrow(
			"Invalid credentials"
		);
	});

	it("should return token and user if login is successful", async () => {
		const input = { email: "test@example.com", password: "correctPassword" };

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
