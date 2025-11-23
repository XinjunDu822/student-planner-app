import request from "supertest";
import app from "../src/app";
import bcrypt from "bcryptjs";
import { prismaMock } from "../singleton";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Endpoints", () => {
  it("successful signup returns JWT", async () => {
    const mockUser = {
      id: "test-id-123",
      name: "newuser",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0
    };

    prismaMock.user.findUnique.mockResolvedValue(null); // user doesn't exist
    prismaMock.user.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "newuser", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("successful signin returns JWT", async () => {
    const mockUser = {
      id: "test-id-456",
      name: "testuser",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("signin with non-existent user returns 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "wronguser", password: "password" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Username does not exist");
  });

  it("signin with wrong password returns 400", async () => {
    const mockUser = {
      id: "test-id-789",
      name: "testuser",
      password: await bcrypt.hash("correctpassword", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Incorrect Password");
  });

  it("signup with existing username returns 409", async () => {
    const existingUser = {
      id: "test-id-000",
      name: "existinguser",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0
    };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "existinguser", password: "password" });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});
