import { AddTask } from "./_components/AddTask";
import { TaskList } from "./_components/activeTasksList";

export default function Home() {
  return (
    <div>
      <h1>Task Management</h1>
      <AddTask />
      <TaskList />
    </div>
  );
}
