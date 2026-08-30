import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import User from "../src/models/user.model.js";
import SavedService from "../src/models/savedService.model.js";


describe("Saved Services API", () => {
  it("should require authentication to save a service", async () => {
    const response = await request(app)
      .post("/api/saved-services/6a8aa1d127d7f9db63cc3a94");

    expect(response.status).toBe(401);
  });

  it("should allow a citizen to save a published service", async () => {
  const user = await User.findOne({
    email: "citizen-test@example.com",
  });

  expect(user).toBeDefined();

  await SavedService.deleteOne({
    userId: user._id,
    serviceId: "6a8aa1d127d7f9db63cc3a94",
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "citizen-test@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .post("/api/saved-services/6a8aa1d127d7f9db63cc3a94")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data.userId).toBeDefined();
  expect(response.body.data.serviceId).toBeDefined();
});

  it("should return only the authenticated user's saved services", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "citizen-test@example.com",
        password: "123456",
      });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/saved-services")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});