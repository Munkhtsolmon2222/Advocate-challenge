import taskResolvers from "@/graphql/resolvers/taskResolvers";
import Task from "@/pages/api/task"; // Adjust the path if needed

// Mocking Task model
jest.mock("@/pages/api/task", () => {
  const save = jest.fn();
  const find = jest.fn();
  const findById = jest.fn();
  const findByIdAndUpdate = jest.fn();

  return {
    __esModule: true,
    default: Object.assign(
      jest.fn(() => ({
        save,
      })),
      {
        find,
        findById,
        findByIdAndUpdate,
      }
    ),
  };
});

// Test suite
describe("Task Resolvers", () => {
  let mockTasks: any;
  let mockUpdatedTask: any;
  let context: any;

  beforeEach(() => {
    mockTasks = [
      {
        _id: "1",
        title: "Task 1",
        description: "First task",
        isDeleted: false,
        userId: "user123",
      },
      {
        _id: "2",
        title: "Task 2",
        description: "Second task",
        isDeleted: false,
        userId: "user123",
      },
    ];

    mockUpdatedTask = {
      _id: "1",
      title: "Updated Task Title",
      description: "Updated description",
      isDeleted: false,
      userId: "user123",
    };

    context = {
      userId: "user123", // Simulate user authentication
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks to avoid polluting other tests
  });

  it("should return all non-deleted tasks", async () => {
    // Mock the find method to return mockTasks
    (Task.find as jest.Mock).mockResolvedValue(mockTasks);

    // Call the resolver method
    const result = await taskResolvers.Query.getAllTasks({}, {}, context);

    // Assert that the Task.find method was called with the correct filter
    expect(Task.find).toHaveBeenCalledWith({
      isDeleted: false,
      userId: context.userId,
    });
    expect(result).toEqual(mockTasks); // The result should match the mocked tasks
  });

  it("should return all deleted tasks", async () => {
    // Mock the find method to return deleted tasks
    (Task.find as jest.Mock).mockResolvedValue([
      { _id: "1", title: "Deleted Task", isDeleted: true, userId: "user123" },
    ]);

    // Call the resolver method
    const result = await taskResolvers.Query.getFinishedTasksLists(
      {},
      {},
      context
    );

    // Assert that the Task.find method was called with the correct filter
    expect(Task.find).toHaveBeenCalledWith({
      isDeleted: true,
      userId: context.userId,
    });
    expect(result).toEqual([
      { _id: "1", title: "Deleted Task", isDeleted: true, userId: "user123" },
    ]);
  });

  it("should update and return the updated task", async () => {
    // Mock the findById method to return a task with the given id
    (Task.findById as jest.Mock).mockResolvedValue(mockUpdatedTask);

    // Mock the findByIdAndUpdate method to return the updated task
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTask);

    // Call the resolver method
    const result = await taskResolvers.Mutation.updateTask(
      {},
      {
        id: "1",
        input: {
          title: "Updated Task Title",
          description: "Updated description",
        },
      },
      context
    );

    // Assert that findByIdAndUpdate was called with the correct parameters
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      {
        $set: {
          title: "Updated Task Title",
          description: "Updated description",
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTask); // The result should be the updated task
  });

  it("should throw an error if task not found", async () => {
    // Mock the findById method to return null (task not found)
    (Task.findById as jest.Mock).mockResolvedValue(null);

    // Call the resolver method and expect it to throw an error
    await expect(
      taskResolvers.Mutation.updateTask(
        {},
        {
          id: "123",
          input: { title: "Updated Title", description: "Updated description" },
        },
        context
      )
    ).rejects.toThrow("Task not found");
  });

  it("should throw an error if the user is not the owner of the task", async () => {
    const otherUserContext = { userId: "user456" }; // Simulate a different user

    // Mock the findById method to return the existing task
    (Task.findById as jest.Mock).mockResolvedValue(mockUpdatedTask);

    // Call the resolver method and expect it to throw an error
    await expect(
      taskResolvers.Mutation.updateTask(
        {},
        {
          id: "1",
          input: { title: "Updated Title", description: "Updated description" },
        },
        otherUserContext
      )
    ).rejects.toThrow("Unauthorized: You can only update your own tasks");
  });

  // Add more tests for other validation cases (taskName uniqueness, description vs taskName, etc.)
});
