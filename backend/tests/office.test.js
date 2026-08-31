import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import { createTestUser } from "./helpers/testData.js";
import { loginTestUser } from "./helpers/auth.js";

const officeData = {
  name: {
    en: "District Administration Office",
    ne: "जिल्ला प्रशासन कार्यालय",
  },
  address: "Main Road",
  province: "Lumbini",
  district: "Banke",
  municipality: "Nepalgunj",
  ward: 10,
  phone: "081000000",
  email: "office@test.com",
  hours: "10:00 AM - 5:00 PM",
};

describe("Office API", () => {
  it("should allow public users to get offices", async () => {
    const response = await request(app)
      .get("/api/offices");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should require authentication to create an office", async () => {
    const response = await request(app)
      .post("/api/offices")
      .send(officeData);

    expect(response.status).toBe(401);
  });

  it("should not allow a citizen to create an office", async () => {
    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post("/api/offices")
      .set("Authorization", `Bearer ${token}`)
      .send(officeData);

    expect(response.status).toBe(403);
  });

  it("should allow an admin to create an office", async () => {
    const admin = await createTestUser({
      role: "admin",
    });

    const token = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const response = await request(app)
      .post("/api/offices")
      .set("Authorization", `Bearer ${token}`)
      .send(officeData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name.en).toBe(
      officeData.name.en
    );
  });

  it("should not allow a citizen to update an office", async () => {
    const admin = await createTestUser({
      role: "admin",
    });

    const adminToken = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const createResponse = await request(app)
      .post("/api/offices")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(officeData);

    expect(createResponse.status).toBe(201);

    const officeId = createResponse.body.data._id;

    const citizen = await createTestUser();

    const citizenToken = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .patch(`/api/offices/${officeId}`)
      .set("Authorization", `Bearer ${citizenToken}`)
      .send({
        address: "Updated Address",
      });

    expect(response.status).toBe(403);
  });

  it("should not allow a citizen to delete an office", async () => {
    const admin = await createTestUser({
      role: "admin",
    });

    const adminToken = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const createResponse = await request(app)
      .post("/api/offices")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(officeData);

    expect(createResponse.status).toBe(201);

    const officeId = createResponse.body.data._id;

    const citizen = await createTestUser();

    const citizenToken = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .delete(`/api/offices/${officeId}`)
      .set("Authorization", `Bearer ${citizenToken}`);

    expect(response.status).toBe(403);
  });
});