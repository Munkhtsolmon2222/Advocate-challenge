import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "@/graphql/resolvers/mutations";

export const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup] = useMutation(SIGNUP);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await signup({
        variables: { username, email, password },
      });
      // Store the token in localStorage or a global state (e.g., Context)
      localStorage.setItem("authToken", data.signup.token);
      // Redirect user to home or dashboard page
      window.location.href = "/auth/login"; // For example
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};
