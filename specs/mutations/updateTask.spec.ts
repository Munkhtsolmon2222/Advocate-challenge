import taskResolvers from "@/graphql/resolvers/taskResolvers";
import Task from "@/pages/api/task";

jest.mock("@/pages/api/task");

describe("updateTask Mutation", () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      userId: "user123",
    };
    jest.clearAllMocks();
  });

  it("should throw an error if user is not authenticated", async () => {
    const input = { taskName: "New Task" };
    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        { userId: null }
      )
    ).rejects.toThrow("Not authenticated");
  });

  it("should throw an error if task is not found", async () => {
    (Task.findById as jest.Mock).mockResolvedValue(null);

    const input = { taskName: "New Task" };

    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        mockContext
      )
    ).rejects.toThrow("Task not found");
  });

  it("should throw an error if user is unauthorized", async () => {
    const fakeTask = { userId: "someoneElse", toString: () => "someoneElse" };
    (Task.findById as jest.Mock).mockResolvedValue(fakeTask);

    const input = { taskName: "New Task" };

    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        mockContext
      )
    ).rejects.toThrow("Unauthorized: You can only update your own tasks");
  });

  it("should throw an error if description is same as taskName", async () => {
    const task = { userId: "user123", toString: () => "user123" };
    (Task.findById as jest.Mock).mockResolvedValue(task);
    (Task.findOne as jest.Mock).mockResolvedValue(null);

    const input = {
      taskName: "SameValue",
      description: "SameValue",
    };

    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        mockContext
      )
    ).rejects.toThrow("Description cannot be the same as taskName");
  });

  it("should throw an error if priority is out of range", async () => {
    const task = { userId: "user123", toString: () => "user123" };
    (Task.findById as jest.Mock).mockResolvedValue(task);
    (Task.findOne as jest.Mock).mockResolvedValue(null);

    const input = {
      priority: 6,
    };

    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        mockContext
      )
    ).rejects.toThrow("Priority must be between 1 and 5");
  });

  it("should throw an error if more than 5 tags are provided", async () => {
    const task = { userId: "user123", toString: () => "user123" };
    (Task.findById as jest.Mock).mockResolvedValue(task);
    (Task.findOne as jest.Mock).mockResolvedValue(null);

    const input = {
      tags: ["a", "b", "c", "d", "e", "f"],
    };

    await expect(
      taskResolvers.Mutation.updateTask(
        null,
        { id: "task123", input },
        mockContext
      )
    ).rejects.toThrow("You can only have up to 5 tags");
  });

  it("should successfully update the task", async () => {
    const task = {
      _id: "task123",
      userId: "user123",
      toString: () => "user123",
    };
    const updatedTask = { _id: "task123", taskName: "Updated Task" };

    (Task.findById as jest.Mock).mockResolvedValue(task);
    (Task.findOne as jest.Mock).mockResolvedValue(null);
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

    const input = {
      taskName: "Updated Task",
      priority: 3,
      description: "This is an updated description",
      tags: ["tag1"],
    };

    const result = await taskResolvers.Mutation.updateTask(
      null,
      { id: "task123", input },
      mockContext
    );

    expect(result).toEqual(updatedTask);
  });
});
