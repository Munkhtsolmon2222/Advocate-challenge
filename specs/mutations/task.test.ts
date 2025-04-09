import Task from "@/pages/api/task";
import request from "supertest";

describe("GraphQL Task API", () => {
  it("should add a task", async () => {
    const mutation = `
      mutation {
        addTask(input: {
          title: "Test Task",
          description: "Test Description"
        }) {
          id
          title
          description
        }
      }
    `;

    const res = await request(Task) // Use the Apollo Server Task directly
      .post("/graphql")
      .send({ query: mutation });

    // Assert that the response matches the expected values
    expect(res.body.data.addTask.title).toBe("Test Task");
    expect(res.body.data.addTask.description).toBe("Test Description");
  });

  it("should update a task", async () => {
    const mutation = `
      mutation {
        updateTask(id: "1", input: { title: "Updated Task", description: "Updated Description" }) {
          id
          title
          description
        }
      }
    `;

    const res = await request(Task).post("/graphql").send({ query: mutation });

    // Assert that the task was updated correctly
    expect(res.body.data.updateTask.title).toBe("Updated Task");
    expect(res.body.data.updateTask.description).toBe("Updated Description");
  });
});
