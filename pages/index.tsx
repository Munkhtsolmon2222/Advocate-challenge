import { useState } from "react";
import { AddTask } from "../_components/AddTask";
import { TaskList } from "../_components/activeTasksList";
import { TaskListFinished } from "../_components/finishedTasksList";
import Link from "next/link";

export default function Home() {
	return (
		<div className="rel-div">
			<div className="container-div">
				<h1>Task Management</h1>
				<div className="container-div">
					{" "}
					<Link href={"/auth/login"}>
						<button>Login</button>
					</Link>
					<Link href={"/auth/signup"}>
						<button>Signup </button>
					</Link>
				</div>
			</div>

			<AddTask />

			<div className="container-div">
				<TaskList />
				<TaskListFinished />
			</div>
		</div>
	);
}
