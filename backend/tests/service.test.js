import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Service API", () => {
  it("should return only published services", async () => {
    const response = await request(app)
      .get("/api/services");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeInstanceOf(Array);

    response.body.data.forEach((service) => {
      expect(service.status).toBe("published");
    });
  });

  it("should not allow unauthenticated users to create a service", async () => {
    const response = await request(app)
      .post("/api/services")
      .send({
        title: "Test Service",
        slug: "test-service",
        description: "This is a test service description.",
        category: "Test",
        fee: 0,
        processingTime: "1 day",
        deliveryMode: "Online",
      });

    expect(response.status).toBe(401);
  });
});

it("should not allow a citizen to create a service", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "citizen-test@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Unauthorized Service",
      slug: "unauthorized-service",
      description: "This service should not be created.",
      category: "Test",
      fee: 0,
      processingTime: "1 day",
      deliveryMode: "Online",
    });

  expect(response.status).toBe(403);
});


it("should allow an admin to create a service", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testadmin@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Automated Test Service",
      slug: `automated-test-service-${Date.now()}`,
      description: "This service is created by an automated test.",
      category: "Test",
      fee: 0,
      processingTime: "1 day",
      deliveryMode: "Online",
    });

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  expect(response.body.data.status).toBe("draft");
});