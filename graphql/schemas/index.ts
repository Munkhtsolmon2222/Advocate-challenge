import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type Task {
		id: ID!
		title: String!
		description: String
		isFinished: Boolean!
		isDeleted: Boolean!
		createdAt: String!
		updatedAt: String!
	}

	input TaskInput {
		title: String!
		description: String
	}

	input TaskUpdateInput {
		title: String
		description: String
		isFinished: Boolean
		isDeleted: Boolean
	}

	type Query {
		getAllTasks: [Task!]!
		getFinishedTasksLists: [Task!]!
	}

	type Mutation {
		addTask(input: TaskInput!): Task!
		updateTask(id: ID!, input: TaskUpdateInput!): Task!
	}
`;
