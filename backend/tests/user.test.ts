// tests/userController.test.ts
import request from "supertest";
import app from "../src/app";  // your Express app
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";

describe("User Controller", () => {
  beforeAll(async () => {
    // Optional: clean up users table
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
          email: "",
          password: "Password123"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /users/signin", () => {
    it("should allow signing in with correct credentials", async () => {
      // first create the user
      await prisma.user.create({
        data: { email: "login@example.com", password: await bcrypt.hash("Password123", 10) }
      });

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
});
