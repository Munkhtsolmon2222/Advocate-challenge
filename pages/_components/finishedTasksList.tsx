import React from "react";
import { useQuery } from "@apollo/client";
import { TaskUpdateDialog } from "./updateTask";
import { GET_FINISHED_TASKS } from "@/graphql/resolvers/queries";

// Simulating logged-in userId (replace this with actual auth logic)
const loggedInUserId = "your_logged_in_user_id_here";

export const TaskListFinished = () => {
  const { data, loading, error } = useQuery(GET_FINISHED_TASKS);

  if (loading) return <p className="animate-pulse">Loading tasks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Finished Task List</h2>
      {data.getFinishedTasksLists.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {data.getFinishedTasksLists.map((task: any) => (
            <li
              key={task._id}
              className="container-div2 p-4 border rounded shadow"
            >
              <p>
                <strong>Task:</strong> {task.taskName}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Tags:</strong> {task.tags.join(", ")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {task.isFinished ? "✅ Done" : "❌ Not done"}
              </p>

              {/* Only show update button if the task belongs to the logged-in user */}
              <div className="mt-2">
                <TaskUpdateDialog
                  taskId={task.id}
                  userId={loggedInUserId}
                  currentTaskName={task.taskName}
                  currentDescription={task.description}
                  currentPriority={task.priority}
                  currentIsFinished={task.isFinished}
                  currentTags={task.tags}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
