import task from "@/pages/api/task";
import taskResolvers from "@/graphql/resolvers/taskResolvers";

jest.mock("@/pages/api/task"); // Mock the Task model

describe("addTask Mutation", () => {
	let mockContext: any;

	beforeEach(() => {
		mockContext = {
			userId: "user123", // Mock a logged-in user
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should throw an error if user is not authenticated", async () => {
		mockContext.userId = null; // Simulate a user who is not authenticated

		const input = {
			description: "Test task",
			priority: 1,
			taskName: "Test Task Name",
			tags: ["tag1", "tag2"],
		};

		await expect(
			taskResolvers.Mutation.addTask(null, { input }, mockContext)
		).rejects.toThrow("Not authenticated");
	});

	it("should create a new task when authenticated", async () => {
		const input = {
			description: "Test task",
			priority: "High",
			taskName: "Test Task Name",
			tags: ["tag1", "tag2"],
		};

		const mockSave = jest.fn().mockResolvedValueOnce({
			...input,
			userId: mockContext.userId,
			isFinished: false,
			isDeleted: false,
		});

		task.prototype.save = mockSave; // Mock the save method on the Task model

		const result = await taskResolvers.Mutation.addTask(
			null,
			{ input },
			mockContext
		);

		expect(mockSave).toHaveBeenCalledTimes(1); // Ensure save was called once
		expect(result).toEqual({
			...input,
			userId: mockContext.userId,
			isFinished: false,
			isDeleted: false,
		}); // Check if the task is created with the correct properties
	});

	it("should handle missing tags (empty array)", async () => {
		const input = {
			description: "Test task",
			priority: "High",
			taskName: "Test Task Name",
			tags: undefined, // Simulate missing tags
		};

		const mockSave = jest.fn().mockResolvedValueOnce({
			...input,
			tags: [],
			userId: mockContext.userId,
			isFinished: false,
			isDeleted: false,
		});

		task.prototype.save = mockSave; // Mock the save method

		const result = await taskResolvers.Mutation.addTask(
			null,
			{ input },
			mockContext
		);

		expect(result.tags).toEqual([]); // Ensure tags are defaulted to an empty array
	});
	it("should default isFinished and isDeleted to false", async () => {
		const input = {
			description: "Another task",
			priority: "Medium",
			taskName: "Another Task",
			tags: ["work"],
		};

		const mockSave = jest.fn().mockResolvedValueOnce({
			...input,
			userId: mockContext.userId,
			isFinished: false,
			isDeleted: false,
		});

		task.prototype.save = mockSave;

		const result = await taskResolvers.Mutation.addTask(
			null,
			{ input },
			mockContext
		);

		expect(result.isFinished).toBe(false);
		expect(result.isDeleted).toBe(false);
	});

	it("should throw an error if save fails", async () => {
		const input = {
			description: "Failing task",
			priority: "Low",
			taskName: "Failure",
			tags: [],
		};

		const mockError = new Error("Database save failed");

		task.prototype.save = jest.fn().mockRejectedValueOnce(mockError);

		await expect(
			taskResolvers.Mutation.addTask(null, { input }, mockContext)
		).rejects.toThrow("Database save failed");
	});

	it("should throw an error if taskName is missing", async () => {
		const input = {
			description: "Missing name",
			priority: "Low",
			// taskName is omitted
		};

		await expect(
			taskResolvers.Mutation.addTask(null, { input }, mockContext)
		).rejects.toThrow(); // or a custom message if you handle it
	});

	it("should throw an error if taskName is an empty string", async () => {
		const input = {
			description: "Description",
			priority: "High",
			taskName: "", // Empty string
			tags: ["tag"],
		};

		await expect(
			taskResolvers.Mutation.addTask(null, { input }, mockContext)
		).rejects.toThrow("taskName is required");
	});

	it("should throw an error if too many tags are provided", async () => {
		const input = {
			description: "Test",
			priority: "Medium",
			taskName: "Task",
			tags: Array(15).fill("tag"), // Simulate too many tags
		};

		await expect(
			taskResolvers.Mutation.addTask(null, { input }, mockContext)
		).rejects.toThrow("Too many tags");
	});
});
