import taskResolvers from "@/graphql/resolvers/taskResolvers";
import Task from "@/pages/api/task";

jest.mock("@/pages/api/task");

describe("getAllTasks Query", () => {
	let mockContext: any;

	beforeEach(() => {
		mockContext = {
			userId: "user123",
		};
		jest.clearAllMocks();
	});

	it("should throw an error if user is not authenticated", async () => {
		await expect(
			taskResolvers.Query.getAllTasks(null, null, { userId: null })
		).rejects.toThrow("Not authenticated");
	});

	it("should return all tasks for authenticated user", async () => {
		const mockTasks = [
			{ taskName: "Task 1", userId: "user123", isFinished: false },
			{ taskName: "Task 2", userId: "user123", isFinished: false },
		];

		(Task.find as jest.Mock).mockResolvedValue(mockTasks);

		const result = await taskResolvers.Query.getAllTasks(
			null,
			null,
			mockContext
		);

		expect(Task.find).toHaveBeenCalledWith({
			isFinished: false,
			userId: "user123",
		});
		expect(result).toEqual(mockTasks);
	});
});
