import { useEffect, useState } from "react";
import { AddTask } from "./_components/AddTask";
import { TaskList } from "./_components/TasksLists";
import { SignupPage } from "./_components/signupForm";
import { LoginPage } from "./_components/loginForm";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to call GraphQL API
  const fetchTasks = async () => {
    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization if you have the token
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              getAllTasks {
                id
                title
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (data.errors && data.errors[0].message === "Not authenticated") {
        // User is not authenticated
        setError("You are not authenticated. Please log in.");
        setIsAuthenticated(false);
      } else {
        // Tasks fetched successfully, user is authenticated
        setIsAuthenticated(true);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Something went wrong.");
    }
  };

  // Check authentication status when component loads
  useEffect(() => {
    fetchTasks(); // Check if the user is authenticated when the component mounts
  }, []);

  // Render the UI based on authentication state
  return (
    <div>
      <h1>Task Management</h1>
      {isAuthenticated === null ? (
        <p>Loading...</p> // Show loading while checking auth
      ) : isAuthenticated ? (
        <>
          <AddTask />
          <TaskList />
        </>
      ) : (
        <>
          {error && <p>{error}</p>}
          {/* Only show one form, either Login or Signup */}
          <LoginPage />
        </>
      )}
    </div>
  );
}
