import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "@/graphql/resolvers/mutations";

export const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(1); // Add state for priority
  const [taskName, setTaskName] = useState(""); // Add state for taskName
  const [addTask] = useMutation(ADD_TASK);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Call the mutation with all required fields
    await addTask({
      variables: {
        input: {
          title,
          description,
          priority, // Include priority in the input
          taskName, // Include taskName in the input
        },
      },
    });

    // Reset the form fields
    setTitle("");
    setDescription("");
    setPriority(1); // Reset priority to default
    setTaskName(""); // Reset taskName to default
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};
