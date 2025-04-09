import Task from "@/pages/api/task";
import taskResolvers from "./taskResolvers";

export const resolvers = {
	Query: {
		...taskResolvers.Query,
	},
	Mutation: {
		...taskResolvers.Mutation,
	},
};
