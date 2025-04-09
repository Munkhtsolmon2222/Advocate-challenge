import { gql } from "@apollo/client";

export const ADD_TASK = gql`
	mutation ($input: TaskInput!) {
		addTask(input: $input) {
			id
			title
			description
		}
	}
`;

export const UPDATE_TASK = gql`
	mutation ($id: ID!, $input: TaskInput!) {
		updateTask(id: $id, input: $input) {
			id
			title
			description
		}
	}
`;

export const DELETE_TASK = gql`
	mutation ($id: ID!) {
		deleteTask(id: $id) {
			id
		}
	}
`;
