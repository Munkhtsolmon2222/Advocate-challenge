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

      // Create new task without specifying _id
      const newTask = new Task({
        title: input.title,
        description: input.description,
        priority: input.priority, // Ensure priority is included
        taskName: input.taskName, // Ensure taskName is included
        userId: context.userId, // Associate task with the logged-in user
        isFinished: false, // Set initial state of task if needed
        isDeleted: false, // Set initial state of task if needed
      });

      // Save the new task to the database and return it
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

      // 1. Validate taskName uniqueness for the user
      if (input.taskName) {
        const existingTask = await Task.findOne({
          taskName: input.taskName,
          userId: context.userId,
        });
        if (existingTask) {
          throw new Error("taskName must be unique for each user");
        }
      }

      // 2. Ensure description is not the same as taskName
      if (
        input.description &&
        input.taskName &&
        input.description === input.taskName
      ) {
        throw new Error("Description cannot be the same as taskName");
      }

      // 3. Validate priority range (1–5)
      if (input.priority && (input.priority < 1 || input.priority > 5)) {
        throw new Error("Priority must be between 1 and 5");
      }

      // 4. Validate tags length <= 5
      if (input.tags && input.tags.length > 5) {
        throw new Error("You can only have up to 5 tags");
      }

      // Proceed with task update if all validations pass
      const updated = await Task.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true } // This returns the updated task
      );

      return updated;
    },
  },
};

export default taskResolvers;
