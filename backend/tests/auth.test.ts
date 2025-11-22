import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma";

//Auth endpoints testing

beforeEach(async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Tests running outside test environment!");
  }
  await prisma.user.deleteMany();
  await prisma.task.deleteMany();
});

describe("AuthEndpoints test", () => {
  it("successful signup, return JWT", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ name: "newuser", password: "password" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("successful signin and return JWT", async () => {
    await prisma.user.create({
      data: { name: "testuser", password: "password" },
    });

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "testuser", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("unsuccessful signin return 400", async () => {
    await prisma.user.create({
      data: { name: "testuser", password: "password" },
    });

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ name: "wronguser", password: "password" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Username does not exist");
  });
});
