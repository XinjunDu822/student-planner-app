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
      password: await bcrypt.hash("$Password1", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0,
    };

    prismaMock.user.findUnique.mockResolvedValue(null); // user doesn't exist
    prismaMock.user.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "newuser", password: "$Password1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("successful signin returns JWT", async () => {
    const mockUser = {
      id: "test-id-456",
      name: "testuser",
      password: await bcrypt.hash("$Password1", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0,
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "$Password1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("signin with non-existent user returns 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "wronguser", password: "Password1" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid username or password.");
  });

  it("signin with wrong password returns 400", async () => {
    const mockUser = {
      id: "test-id-789",
      name: "testuser",
      password: await bcrypt.hash("Correctpassword1", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0,
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "Wrongpassword1" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid username or password.");
  });

  it("signup with existing username returns 409", async () => {
    const existingUser = {
      id: "test-id-000",
      name: "existinguser",
      password: await bcrypt.hash("$Password1", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0,
    };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "existinguser", password: "$Password1" });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "Username already in use.");
  });

  it("signup w/ missing password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "newuser" }); // Missing password

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and password are required."
    );
  });

  it("signup w/ missing username returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ password: "password" }); // Missing username

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and password are required."
    );
  });

  it("signin w/ missing password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "newuser" }); // Missing password

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and password are required."
    );
  });

  it("signin w/ missing username returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ password: "password" }); // Missing username

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and password are required."
    );
  });
});
