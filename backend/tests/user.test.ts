// tests/userController.test.ts
import request from "supertest";
import app from "../src/app";  // your Express app
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";

describe("User Controller", () => {
  beforeAll(async () => {
    // Clean up users table before tests
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /users/signup", () => {
    it("should create a new user and return a token", async () => {
      const res = await request(app)
        .post("/users/signup")
        .send({
          name: "Test User",          // <--- required
          email: "test@example.com",
          password: "Password123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not allow empty email", async () => {
      const res = await request(app)
        .post("/users/signup")
        .send({
          name: "No Email User",      // <--- still required
          email: "",
          password: "Password123"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /users/signin", () => {
    beforeAll(async () => {
      // Ensure user exists for signin
      await prisma.user.create({
        data: {
          name: "Login User",
          email: "login@example.com",
          password: await bcrypt.hash("Password123", 10)
        }
      });
    });

    it("should allow signing in with correct credentials", async () => {
      const res = await request(app)
        .post("/users/signin")
        .send({
          email: "login@example.com",
          password: "Password123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail signing in with wrong password", async () => {
      const res = await request(app)
        .post("/users/signin")
        .send({
          email: "login@example.com",
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Check email existence", () => {
    beforeAll(async () => {
      // Create a user for existence test
      await prisma.user.create({
        data: {
          name: "Existence User",
          email: "exists@example.com",
          password: await bcrypt.hash("Password123", 10)
        }
      });
    });

    it("should return true if email exists", async () => {
      const res = await request(app)
        .post("/users/check-email")
        .send({ email: "exists@example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body.exists).toBe(true);
    });

    it("should return false if email does not exist", async () => {
      const res = await request(app)
        .post("/users/check-email")
        .send({ email: "notfound@example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body.exists).toBe(false);
    });
  });

  describe("GET /users/:id", () => {
    it("should return user data when given a valid ID", async () => {
        // Arrange: create a user
        const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: "getuser@example.com",
            password: await bcrypt.hash("Password123", 10),
        },
        });

        // Act: request user
        const res = await request(app).get(`/users/${user.id}`);

        // Assert
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", user.id);
        expect(res.body).toHaveProperty("email", "getuser@example.com");
        expect(res.body).not.toHaveProperty("password"); // do NOT expose password
    });

    it("should return 404 if user does not exist", async () => {
        const res = await request(app).get("/users/does-not-exist");

        expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /users/:id", () => {
  it("should update a user's name", async () => {
    // Arrange: create a user
    const user = await prisma.user.create({
      data: {
        name: "Original Name",
        email: "update@example.com",
        password: await bcrypt.hash("Password123", 10)
      }
    });

    // Act: update the name
    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: "Updated Name" });

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated Name");
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app)
      .put("/users/not-a-real-id")
      .send({ name: "Anything" });

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 if no fields are provided", async () => {
    // Arrange: create a user
    const user = await prisma.user.create({
      data: {
        name: "Some Name",
        email: "emptyupdate@example.com",
        password: await bcrypt.hash("Password123", 10)
      }
    });

    // Act
    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /users/:id", () => {
  it("should delete an existing user", async () => {
    // Arrange: create a user
    const user = await prisma.user.create({
      data: {
        name: "Delete Me",
        email: "delete@example.com",
        password: await bcrypt.hash("Password123", 10),
      },
    });

    // Act: delete user
    const res = await request(app).delete(`/users/${user.id}`);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted");

    // Verify user is actually gone
    const check = await prisma.user.findUnique({ where: { id: user.id } });
    expect(check).toBeNull();
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app).delete("/users/not-real-id");

    expect(res.statusCode).toBe(404);
  });
});


});
