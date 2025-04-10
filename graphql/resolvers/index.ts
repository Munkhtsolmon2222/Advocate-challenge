import Task from "@/pages/api/task";
import taskResolvers from "./taskResolvers";
import userResolvers from "./authResolvers";

export const resolvers = {
  Query: {
    ...taskResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
