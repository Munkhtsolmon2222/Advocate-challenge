import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TASKS } from "@/graphql/resolvers/queries";
import { TaskUpdateDialog } from "./updateTask";

const loggedInUserId = "";

export const TaskList = () => {
	const { data, loading, error } = useQuery(GET_ALL_TASKS);

	if (loading) return <p className="animate-pulse">Loading tasks...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div className="items-center">
			<h2 className="text-xl font-bold mb-4">Active Task List</h2>
			<div className="w-fit mx-auto">
				{data.getAllTasks.length === 0 ? (
					<p>No tasks found.</p>
				) : (
					<ul className="space-y-4 items-center">
						{data.getAllTasks.map((task: any) => (
							<li
								key={task._id}
								className=" container-div2 p-4 border rounded shadow"
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
		</div>
	);
};
