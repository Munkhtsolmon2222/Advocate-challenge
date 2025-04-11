import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/graphql/resolvers/mutations";

export const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useMutation(LOGIN);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const { data } = await login({
				variables: { email, password },
			});
			localStorage.setItem("authToken", data.login.token);
			window.location.href = "/";
		} catch (error: any) {
			console.error("Login error:", error.message);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};
