import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import {
  createTestUser,
  createTestService,
} from "./helpers/testData.js";

import { loginTestUser } from "./helpers/auth.js";

describe("Service API", () => {
  it("should return only published services", async () => {
    await createTestService({ status: "published" });
    await createTestService({ status: "draft" });

    const response = await request(app)
      .get("/api/services");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    response.body.data.forEach((service) => {
      expect(service.status).toBe("published");
    });
  });

  it("should not allow unauthenticated users to create a service", async () => {
    const response = await request(app)
      .post("/api/services")
      .send({
        title: "Unauthorized Service",
        slug: `unauthorized-${Date.now()}`,
        description: "This should not be created.",
        category: "Test",
        fee: 0,
        processingTime: "1 day",
        deliveryMode: "Online",
      });

    expect(response.status).toBe(401);
  });

  it("should not allow a citizen to create a service", async () => {
    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Citizen Service",
        slug: `citizen-service-${Date.now()}`,
        description: "This should not be created.",
        category: "Test",
        fee: 0,
        processingTime: "1 day",
        deliveryMode: "Online",
      });

    expect(response.status).toBe(403);
  });

  it("should allow an admin to create a service", async () => {
    const admin = await createTestUser({
      role: "admin",
    });

    const token = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const response = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Admin Test Service",
        slug: `admin-test-${Date.now()}`,
        description: "Created by an admin test.",
        category: "Test",
        fee: 0,
        processingTime: "1 day",
        deliveryMode: "Online",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("draft");
  });

 it("should return 409 when creating a service with a duplicate slug", async () => {
  const admin = await createTestUser({
    role: "admin",
  });

  const adminToken = await loginTestUser({
    email: admin.email,
    password: admin.password,
  });

  const serviceData = {
    title: "Test Service",
    slug: "duplicate-service",
    description: "Test description",
    category: "Test",
    fee: 100,
    processingTime: "7 days",
    deliveryMode: "Online",
  };

  const first = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(serviceData);

  expect(first.status).toBe(201);

  const second = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(serviceData);

  expect(second.status).toBe(409);
  expect(second.body.success).toBe(false);
});

});