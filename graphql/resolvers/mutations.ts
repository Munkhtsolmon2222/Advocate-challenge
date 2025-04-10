import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation ($input: TaskInput!) {
    addTask(input: $input) {
      id
      title
      description
      priority
      taskName
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation ($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      priority
      taskName
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

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
