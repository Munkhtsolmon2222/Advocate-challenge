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
      // Store the token in localStorage or a global state (e.g., Context)
      localStorage.setItem("authToken", data.login.token);
      // Redirect user to home or dashboard page
      window.location.href = "/"; // For example
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
