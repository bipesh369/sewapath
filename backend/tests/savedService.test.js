import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import {
  createTestUser,
  createTestService,
} from "./helpers/testData.js";

import { loginTestUser } from "./helpers/auth.js";

describe("Saved Services API", () => {
  it("should require authentication to save a service", async () => {
    const service = await createTestService();

    const response = await request(app)
      .post(`/api/saved-services/${service._id}`);

    expect(response.status).toBe(401);
  });

  it("should allow a citizen to save a published service", async () => {
    const service = await createTestService({
      status: "published",
    });

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post(`/api/saved-services/${service._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data.userId).toBe(
      citizen.user._id.toString()
    );

    expect(response.body.data.serviceId).toBe(
      service._id.toString()
    );
  });

  it("should return only the authenticated user's saved services", async () => {
    const service = await createTestService();

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    await request(app)
      .post(`/api/saved-services/${service._id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/api/saved-services")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBe(1);

    expect(
      response.body.data[0].serviceId._id
    ).toBe(service._id.toString());
  });

  it("should allow a citizen to remove their saved service", async () => {
    const service = await createTestService();

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    await request(app)
      .post(`/api/saved-services/${service._id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .delete(`/api/saved-services/${service._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should not allow a user to remove another user's saved service", async () => {
  const service = await createTestService({
    status: "published",
  });

  const userA = await createTestUser();
  const userB = await createTestUser();

  const tokenA = await loginTestUser({
    email: userA.email,
    password: userA.password,
  });

  const tokenB = await loginTestUser({
    email: userB.email,
    password: userB.password,
  });

  // User A saves the service
  await request(app)
    .post(`/api/saved-services/${service._id}`)
    .set("Authorization", `Bearer ${tokenA}`);

  // User B tries to remove User A's saved service
  const response = await request(app)
    .delete(`/api/saved-services/${service._id}`)
    .set("Authorization", `Bearer ${tokenB}`);

  expect(response.status).toBe(404);

  // Confirm User A's saved service still exists
  const savedServices = await request(app)
    .get("/api/saved-services")
    .set("Authorization", `Bearer ${tokenA}`);

  expect(savedServices.status).toBe(200);
  expect(savedServices.body.data.length).toBe(1);
});

});