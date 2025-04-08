import Task from "@/pages/api/task";

const taskResolvers = {
  Query: {
    getAllTasks: async () => {
      return await Task.find({ isDeleted: false });
    },
    getFinishedTasksLists: async () => {
      return await Task.find({ isDeleted: true });
    },
  },

  Mutation: {
    addTask: async (_: any, { input }: any) => {
      const newTask = new Task({
        title: input.title,
        description: input.description,
      });
      return await newTask.save();
    },

    updateTask: async (_: any, { id, input }: any) => {
      const updated = await Task.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );
      if (!updated) {
        throw new Error("Task not found");
      }
      return updated;
    },
  },
};

export default taskResolvers;
