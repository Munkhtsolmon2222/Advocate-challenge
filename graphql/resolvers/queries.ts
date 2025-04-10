import { gql } from "@apollo/client";

export const GET_ALL_TASKS = gql`
  query {
    getAllTasks {
      id
      taskName
      priority
      title
      description
    }
  }
`;

export const GET_FINISHED_TASKS = gql`
  query {
    getFinishedTasksLists {
      id
      taskName
      priority
      title
      description
    }
  }
`;
