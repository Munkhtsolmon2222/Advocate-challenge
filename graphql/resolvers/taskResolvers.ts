import Task from "@/pages/api/task"; // your Task model

const taskResolvers = {
  Query: {
    getAllTasks: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }
      return await Task.find({ isDeleted: false, userId: context.userId }); // Filter by userId
    },

    getFinishedTasksLists: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }
      return await Task.find({ isDeleted: true, userId: context.userId }); // Filter by userId
    },
  },

  Mutation: {
    addTask: async (_: any, { input }: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const newTask = new Task({
        title: input.title,
        description: input.description,
        userId: context.userId, // Associate task with the logged-in user
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

      // Proceed with task update if user is authorized
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
