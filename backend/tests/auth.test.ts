import request from "supertest";
import app from "../src/app";
import bcrypt from "bcryptjs";
import { prismaMock } from "../singleton";
import jwt from "jsonwebtoken";

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
      password: await bcrypt.hash("$Correctpassword1", 10),
      createdAt: new Date(),
      currStreak: 0,
      bestStreak: 0,
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "$Wrongpassword1" });

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

  // Test password requirements
  it("signup with weak password returns 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "validuser", password: "weak" }); // no uppercase, no special char

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and/or password do not satisfy requirements!"
    );
  });

  // Test username requirements
  it("signup with invalid username returns 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "ab", password: "$Password1" }); // only 2 letters

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Username and/or password do not satisfy requirements!"
    );
  });
});

describe("Auth Logout", () => {
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


  it("should logout successfully", async () => {
    const token = jwt.sign({ id: "123", name: "Alice" }, JWT_SECRET);

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out successfully.");
  });

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

it("should logout successfully", async () => {
  const token = jwt.sign({ id: "test-id-123", name: "Alice" }, JWT_SECRET, { expiresIn: "1h" });

  const res = await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${token}`)
    .send();

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message", "Logged out successfully.");
});
it("allows access with valid token", async () => {
  const token = jwt.sign({ id: "123", name: "Alice" }, JWT_SECRET, { expiresIn: "1h" });

  const res = await request(app)
    .get("/test/protected")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message", "Hello Alice");
});

it("denies access with missing token", async () => {
  const res = await request(app).get("/test/protected");

  expect(res.statusCode).toBe(401);
  expect(res.body).toHaveProperty("message", "No token provided");
});

it("denies access with invalid token", async () => {
  const res = await request(app)
    .get("/test/protected")
    .set("Authorization", "Bearer invalidtoken");

  expect(res.statusCode).toBe(401);
  expect(res.body).toHaveProperty("message", "Token is invalid or expired");
});

});
