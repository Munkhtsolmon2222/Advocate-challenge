import taskResolvers from "@/graphql/resolvers/taskResolvers";
import Task from "@/pages/api/task";

jest.mock("@/pages/api/task");

describe("getFinishedTasksLists Query", () => {
	let mockContext: any;

	beforeEach(() => {
		mockContext = { userId: "user123" };
		jest.clearAllMocks();
	});

	it("should throw an error if user is not authenticated", async () => {
		await expect(
			taskResolvers.Query.getFinishedTasksLists(null, null, { userId: null })
		).rejects.toThrow("Not authenticated");
	});

	it("should return only finished tasks for the authenticated user", async () => {
		const mockTasks = [
			{ taskName: "Completed 1", isFinished: true, userId: "user123" },
			{ taskName: "Completed 2", isFinished: true, userId: "user123" },
		];

		(Task.find as jest.Mock).mockResolvedValue(mockTasks);

		const result = await taskResolvers.Query.getFinishedTasksLists(
			null,
			null,
			mockContext
		);

		expect(Task.find).toHaveBeenCalledWith({
			isFinished: true,
			userId: "user123",
		});
		expect(result).toEqual(mockTasks);
	});
});
