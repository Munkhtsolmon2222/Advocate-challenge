import { sayHello } from "./mutations/say-hello";
import { helloQuery } from "./queries/hello-query";
import Task from "@/pages/api/task";
import taskResolvers from "./taskResolvers";

export const resolvers = {
  Query: {
    helloQuery,
    ...taskResolvers.Query,
  },
  Mutation: {
    sayHello,
    ...taskResolvers.Mutation,
  },
};
