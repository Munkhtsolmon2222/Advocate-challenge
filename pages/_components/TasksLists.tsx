import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TASKS } from "@/graphql/resolvers/queries";

export const TaskList = () => {
	const { data, loading, error } = useQuery(GET_ALL_TASKS);

	if (loading) return <p>Loading tasks...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h2>Task List</h2>
			{data.getAllTasks.length === 0 ? (
				<p>No tasks found.</p>
			) : (
				<ul>
					{data.getAllTasks.map((task: any) => (
						<li key={task.id}>
							<p>
								{task.title} - {task.description}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
