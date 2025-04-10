import { useState } from "react";
import { AddTask } from "./_components/AddTask";
import { TaskList } from "./_components/activeTasksList";
import { TaskListFinished } from "./_components/finishedTasksList";

export default function Home() {
	const [isClicked, setIsClicked] = useState<boolean>(false);
	return (
		<div>
			<h1>Task Management</h1>
			<AddTask />
			<TaskList />
			<button onClick={() => setIsClicked(!isClicked)}>Finished tasks</button>
			{isClicked && <TaskListFinished />}
		</div>
	);
}
