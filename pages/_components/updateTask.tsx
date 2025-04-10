import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Dialog } from "@shadcn/ui"; // ShadCN Dialog component
import { gql } from "graphql-tag";

// Define the updateTask mutation
const UPDATE_TASK = gql`
  mutation updateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) {
      _id
      title
      description
      isDeleted
    }
  }
`;

type TaskInput = {
  title: string;
  description: string;
  isDeleted: boolean;
};

const TaskUpdateDialog = ({
  taskId,
  currentTitle,
  currentDescription,
}: {
  taskId: string;
  currentTitle: string;
  currentDescription: string;
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [updateTask, { loading, error, data }] = useMutation(UPDATE_TASK);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the updateTask mutation with the new data
    try {
      const response = await updateTask({
        variables: {
          id: taskId,
          input: { title, description, isDeleted: false }, // Assume we don't want to delete here
        },
      });
      console.log("Updated Task:", response.data.updateTask);
      setOpen(false); // Close the dialog on success
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div>
      {/* Button to open the dialog */}
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        Update Task
      </button>

      {/* ShadCN Dialog for Task Update */}
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Header>Update Task</Dialog.Header>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success"
              >
                {loading ? "Updating..." : "Update Task"}
              </button>
            </div>
          </form>

          {error && <p className="text-error">{error.message}</p>}
          {data && <p className="text-success">Task updated successfully!</p>}
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default TaskUpdateDialog;
