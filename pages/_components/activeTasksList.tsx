import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TASKS } from "@/graphql/resolvers/queries";
import TaskUpdateDialog from "./updateTask";

export const TaskList = () => {
  const { data, loading, error } = useQuery(GET_ALL_TASKS);
  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);

  if (loading) return <p className="animate-pulse">Loading tasks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleTaskClick = (task: any) => {
    setSelectedTask({
      id: task._id,
      title: task.title,
      description: task.description,
    });
  };

  return (
    <div>
      <h2>Active Task List</h2>
      {data.getAllTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {data.getAllTasks.map((task: any) => (
            <li key={task._id}>
              <p>{task.title}</p>
              {/* Add a button to open the update dialog */}
              <button
                onClick={() => handleTaskClick(task)}
                className="btn btn-primary"
              >
                Update Task
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Conditionally render the update dialog when a task is selected */}
      {selectedTask && (
        <TaskUpdateDialog
          taskId={selectedTask.id}
          currentTitle={selectedTask.title}
          currentDescription={selectedTask.description}
        />
      )}
    </div>
  );
};
