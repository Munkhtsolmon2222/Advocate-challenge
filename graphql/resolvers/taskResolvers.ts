import Task from "@/pages/api/task"; // your Task model

const taskResolvers = {
  Query: {
    getAllTasks: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }
      return await Task.find({ isFinished: false, userId: context.userId });
    },

    getFinishedTasksLists: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }
      return await Task.find({ isFinished: true, userId: context.userId });
    },
  },

  Mutation: {
    addTask: async (_: any, { input }: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      if (!input.taskName?.trim()) {
        throw new Error("taskName is required");
      }
      if (!input.priority) {
        throw new Error("priority is required");
      }
      if (!input.description?.trim()) {
        throw new Error("description is required");
      }
      if (input.tags?.length >= 5) {
        throw new Error("Too many tags");
      }
      const newTask = new Task({
        description: input.description,
        priority: input.priority,
        taskName: input.taskName,
        userId: context.userId,
        isFinished: false,
        isDeleted: false,
        tags: input.tags || [],
      });

      return await newTask.save();
    },
    updateTask: async (_: any, { id, input }: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const task: any = await Task.findById(id);
      if (!task) {
        throw new Error("Task not found");
      }

      if (task.userId.toString() !== context.userId) {
        throw new Error("Unauthorized: You can only update your own tasks");
      }

      if (
        input.description &&
        input.taskName &&
        input.description === input.taskName
      ) {
        throw new Error("Description cannot be the same as taskName");
      }

      if (input.priority && (input.priority < 1 || input.priority > 5)) {
        throw new Error("Priority must be between 1 and 5");
      }

      if (input.tags && input.tags.length > 5) {
        throw new Error("You can only have up to 5 tags");
      }

      const updated = await Task.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );

      return updated;
    },
  },
};

export default taskResolvers;
