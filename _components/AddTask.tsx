import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "@/graphql/resolvers/mutations";

export const AddTask = () => {
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<number>(1);
	const [taskName, setTaskName] = useState("");
	const [tagsInput, setTagsInput] = useState("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [addTask] = useMutation(ADD_TASK);

	const validate = () => {
		const newErrors: { [key: string]: string } = {};
		const tags = tagsInput
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);

		if (!taskName.trim()) newErrors.taskName = "Task name is required.";
		if (!description.trim()) newErrors.description = "Description is required.";
		else if (description.length < 10)
			newErrors.description = "Description must be at least 10 characters.";
		if (!(priority >= 1 && priority <= 5))
			newErrors.priority = "Priority must be between 1 and 5.";
		if (tags.length > 4) newErrors.tags = "You can only add up to 4 tags.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

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
					tags,
				},
			},
		});

		setDescription("");
		setPriority(1);
		setTaskName("");
		setTagsInput("");
		setErrors({});
		window.location.reload();
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">Add Task</h2>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<input
						type="text"
						placeholder="Task Name"
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						className="border px-3 py-2 rounded w-full"
					/>
					{errors.taskName && (
						<p className="text-red-500 text-sm">{errors.taskName}</p>
					)}
				</div>
				<div>
					<input
						type="text"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="border px-3 py-2 rounded w-full"
					/>
					{errors.description && (
						<p className="text-red-500 text-sm">{errors.description}</p>
					)}
				</div>
				<div>
					<input
						type="number"
						placeholder="Priority (1-5)"
						value={priority}
						onChange={(e) => setPriority(Number(e.target.value))}
						className="border px-3 py-2 rounded w-full"
					/>
					{errors.priority && (
						<p className="text-red-500 text-sm">{errors.priority}</p>
					)}
				</div>
				<div>
					<input
						type="text"
						placeholder="Tags (comma-separated)"
						value={tagsInput}
						onChange={(e) => setTagsInput(e.target.value)}
						className="border px-3 py-2 rounded w-full"
					/>
					{errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
				</div>
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
