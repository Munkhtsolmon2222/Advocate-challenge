import { gql } from "@apollo/client";

export const GET_ALL_TASKS = gql`
	query {
		getAllTasks {
			id
			title
			description
		}
	}
`;

export const GET_FINISHED_TASKS = gql`
	query {
		getFinishedTasksLists {
			id
			title
			description
		}
	}
`;
