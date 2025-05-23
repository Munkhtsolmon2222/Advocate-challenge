import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type Task {
		id: ID!
		description: String
		isFinished: Boolean!
		isDeleted: Boolean!
		createdAt: String!
		updatedAt: String!
		priority: Int!
		taskName: String!
		tags: [String!]!
	}

	input TaskInput {
		description: String
		priority: Int!
		taskName: String!
		tags: [String]
	}

	input TaskUpdateInput {
		description: String
		isFinished: Boolean
		isDeleted: Boolean
		taskName: String
		priority: Int
		tags: [String]
	}

	type User {
		id: ID!
		username: String!
		email: String!
		password: String!
	}

	input UserInput {
		username: String!
		email: String!
		password: String!
	}

	type Query {
		getAllTasks: [Task!]!
		getFinishedTasksLists: [Task!]!
		getUser(id: ID!): User
	}

	type Mutation {
		addTask(input: TaskInput!): Task!
		updateTask(id: ID!, input: TaskUpdateInput!): Task!

		signup(username: String!, email: String!, password: String!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!
	}

	type AuthPayload {
		token: String!
		user: User!
	}
`;
