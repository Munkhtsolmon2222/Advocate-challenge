import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { UPDATE_TASK } from "@/graphql/resolvers/mutations";

type TaskUpdateDialogProps = {
	taskId: string;
	userId: string;
	currentTaskName: string;
	currentDescription: string;
	currentPriority: number;
	currentIsFinished: boolean;
	currentTags: string[];
};

export const TaskUpdateDialog = ({
	taskId,
	userId,
	currentTaskName,
	currentDescription,
	currentPriority,
	currentIsFinished,
	currentTags,
}: TaskUpdateDialogProps) => {
	const [taskName, setTaskName] = useState(currentTaskName);
	const [description, setDescription] = useState(currentDescription);
	const [priority, setPriority] = useState(currentPriority);
	const [isFinished, setIsFinished] = useState(currentIsFinished);
	const [tags, setTags] = useState<string[]>(currentTags);
	const [newTag, setNewTag] = useState("");

	const [open, setOpen] = useState(false);
	const [updateTask, { loading, error, data }] = useMutation(UPDATE_TASK);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (priority < 1 || priority > 5) {
			alert("Priority must be between 1 and 5");
			return;
		}

		try {
			await updateTask({
				variables: {
					id: taskId,
					input: {
						taskName,
						description,
						priority,
						isFinished,
						tags,
					},
				},
			});
			setOpen(false);
		} catch (err) {
			console.error("Update failed:", err);
		}
	};

	const addTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag("");
		}
	};

	const removeTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag));
	};

	return (
		<div>
			<button onClick={() => setOpen(true)} className="btn btn-primary">
				Update Task
			</button>

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">Update Task</h2>
							<button
								onClick={() => setOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							{/* Task Name */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Task Name
								</label>
								<input
									type="text"
									value={taskName}
									onChange={(e) => setTaskName(e.target.value)}
									className="w-full px-3 py-2 border rounded"
									required
								/>
							</div>

							{/* Description */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Description
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="w-full px-3 py-2 border rounded"
									required
								/>
							</div>

							{/* Priority */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Priority (1–5)
								</label>
								<input
									type="number"
									min={1}
									max={5}
									value={priority}
									onChange={(e) => setPriority(parseInt(e.target.value))}
									className="w-full px-3 py-2 border rounded"
									required
								/>
							</div>

							{/* isFinished */}
							<div className="mb-4">
								<label className="inline-flex items-center">
									<input
										type="checkbox"
										checked={isFinished}
										onChange={(e) => setIsFinished(e.target.checked)}
										className="mr-2"
									/>
									Mark as done
								</label>
							</div>

							{/* Tags */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">Tags</label>
								<div className="flex gap-2 mb-2">
									<input
										type="text"
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										className="w-full px-3 py-2 border rounded"
										placeholder="Add tag"
									/>
									<button
										type="button"
										onClick={addTag}
										className="bg-blue-500 text-white px-3 py-1 rounded"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{tags.map((tag) => (
										<span
											key={tag}
											className="bg-gray-200 px-2 py-1 rounded flex items-center"
										>
											{tag}
											<button
												onClick={() => removeTag(tag)}
												className="ml-2 text-red-600 font-bold"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>

							{/* Submit */}
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={loading}
									className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
								>
									{loading ? "Updating..." : "Update Task"}
								</button>
							</div>
						</form>

						{error && <p className="text-red-500 mt-2">{error.message}</p>}
						{data && (
							<p className="text-green-600 mt-2">Task updated successfully!</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
