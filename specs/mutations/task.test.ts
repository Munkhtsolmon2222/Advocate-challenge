import taskResolvers from "@/graphql/resolvers/taskResolvers";
import Task from "@/pages/api/task"; // Adjust the path if needed

// Mocking Task model
jest.mock("@/pages/api/task", () => {
	const save = jest.fn();
	const find = jest.fn();
	const findByIdAndUpdate = jest.fn();

	return {
		__esModule: true,
		default: Object.assign(
			jest.fn(() => ({
				save,
			})),
			{
				find,
				findByIdAndUpdate,
			}
		),
	};
});

// Test suite
describe("Task Resolvers", () => {
	let mockTasks: any;
	let mockUpdatedTask: any;

	beforeEach(() => {
		mockTasks = [
			{ title: "Task 1", isDeleted: false },
			{ title: "Task 2", isDeleted: false },
		];

		mockUpdatedTask = {
			_id: "1",
			title: "Updated Task Title",
			isDeleted: false,
		};
	});

	afterEach(() => {
		jest.clearAllMocks(); // Clear mocks to avoid polluting other tests
	});

	it("should return all non-deleted tasks", async () => {
		// Mock the find method to return mockTasks
		(Task.find as jest.Mock).mockResolvedValue(mockTasks);

		// Call the resolver method
		const result = await taskResolvers.Query.getAllTasks();

		// Assert that the Task.find method was called with the correct filter
		expect(Task.find).toHaveBeenCalledWith({ isDeleted: false });
		expect(result).toEqual(mockTasks); // The result should match the mocked tasks
	});

	it("should return all deleted tasks", async () => {
		// Mock the find method to return mockTasks
		(Task.find as jest.Mock).mockResolvedValue([
			{ title: "Deleted Task", isDeleted: true },
		]);

		// Call the resolver method
		const result = await taskResolvers.Query.getFinishedTasksLists();

		// Assert that the Task.find method was called with the correct filter
		expect(Task.find).toHaveBeenCalledWith({ isDeleted: true });
		expect(result).toEqual([{ title: "Deleted Task", isDeleted: true }]);
	});
	it("should update and return the updated task", async () => {
		// Mock the findByIdAndUpdate method to return the updated task
		(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTask);

		// Call the resolver method
		const result = await taskResolvers.Mutation.updateTask(
			{},
			{ id: "1", input: { title: "Updated Title" } }
		);

		// Assert that findByIdAndUpdate was called with the correct parameters
		expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
			"1",
			{ $set: { title: "Updated Title" } }, // Corrected: Use $set for the update
			{ new: true }
		);
		expect(result).toEqual(mockUpdatedTask); // The result should be the updated task
	});

	it("should throw an error if task not found", async () => {
		// Mock the findByIdAndUpdate method to return null
		(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

		// Call the resolver method and expect it to throw an error
		await expect(
			taskResolvers.Mutation.updateTask(
				{},
				{ id: "123", input: { title: "Updated Title" } }
			)
		).rejects.toThrow("Task not found");
	});
});
