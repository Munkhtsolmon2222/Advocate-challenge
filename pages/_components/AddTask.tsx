import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "@/graphql/resolvers/mutations";

export const AddTask = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [addTask] = useMutation(ADD_TASK);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		await addTask({
			variables: { input: { title, description } },
		});
		setTitle("");
		setDescription("");
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
				<button type="submit">Add Task</button>
			</form>
		</div>
	);
};
