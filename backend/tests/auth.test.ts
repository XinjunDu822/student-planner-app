import request from "supertest";
import app from "../src/app";
import bcrypt from "bcryptjs";
import { prismaMock } from "../singleton";

//Auth endpoints testing

beforeEach(() => {
  // Clear all mock calls between tests
  jest.clearAllMocks();
});

describe("AuthEndpoints test", () => {
  it("successful signup, return JWT", async () => {
    const mockUser = {
      id: "test-id-123",
      name: "newuser",
      password: await bcrypt.hash("password", 10),
    };

    prismaMock.user.findUnique.mockResolvedValue(null); // (user doesnt exist if searching if user exists)

    prismaMock.user.create.mockResolvedValue(mockUser); //create the new user for signup

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "newuser", password: "password" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("successful signin and return JWT", async () => {
    const mockUser = {
      id: "test-id-456",
      name: "testuser",
      password: await bcrypt.hash("password", 10),
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("unsuccessful signin return 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null); // User is not found

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "wronguser", password: "password" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Username does not exist");
  });

  it("wrong password signin return 400", async () => {
    const mockUser = {
      id: 1,
      name: "testuser",
      password: await bcrypt.hash("correctpassword", 10),
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser); // User exists

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "wrongpassword" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Incorrect Password");
  });

  it("signup with existing username returns 409", async () => {
    const existingUser = {
      id: 1,
      name: "existinguser",
      password: await bcrypt.hash("password", 10),
    };

    prismaMock.user.findUnique.mockResolvedValue(existingUser); //user already exists

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "existinguser", password: "password" });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});
