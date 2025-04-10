import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "@/graphql/resolvers/mutations";

export const AddTask = () => {
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<number>(1);
	const [taskName, setTaskName] = useState("");
	const [tagsInput, setTagsInput] = useState(""); // comma-separated tags
	const [addTask] = useMutation(ADD_TASK);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const tags = tagsInput
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);

		await addTask({
			variables: {
				input: {
					description,
					priority,
					taskName,
					tags, // send as array of strings
				},
			},
		});

		// Reset fields
		setDescription("");
		setPriority(1);
		setTaskName("");
		setTagsInput("");
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">Add Task</h2>
			<form onSubmit={handleSubmit} className="space-y-3">
				{" "}
				<input
					type="text"
					placeholder="Task Name"
					value={taskName}
					onChange={(e) => setTaskName(e.target.value)}
					className="border px-3 py-2 rounded w-full"
				/>
				<input
					type="text"
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="border px-3 py-2 rounded w-full"
				/>
				<input
					type="number"
					placeholder="Priority (1-5)"
					value={priority}
					onChange={(e) => setPriority(Number(e.target.value))}
					className="border px-3 py-2 rounded w-full"
				/>
				<input
					type="text"
					placeholder="Tags (comma-separated)"
					value={tagsInput}
					onChange={(e) => setTagsInput(e.target.value)}
					className="border px-3 py-2 rounded w-full"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Add Task
				</button>
			</form>
		</div>
	);
};
