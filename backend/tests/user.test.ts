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
});
