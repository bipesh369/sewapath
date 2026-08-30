import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import {
  createTestUser,
  createTestService,
} from "./helpers/testData.js";

import { loginTestUser } from "./helpers/auth.js";

describe("Journey API", () => {
  it("should allow public users to get journey steps", async () => {
    const service = await createTestService();

    const response = await request(app)
      .get(`/api/services/${service._id}/journey`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should not allow a citizen to create a journey step", async () => {
    const service = await createTestService();

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post(`/api/services/${service._id}/journey`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: 1,
        title: {
          en: "Test Journey Step",
          ne: "परीक्षण यात्रा चरण",
        },
        instructions: {
          en: "Complete this step.",
          ne: "यो चरण पूरा गर्नुहोस्।",
        },
        responsibleOffice: null,
        estimatedTime: {
          en: "1 day",
          ne: "१ दिन",
        },
      });

    expect(response.status).toBe(403);
  });

  it("should allow an admin to create a journey step", async () => {
    const service = await createTestService();

    const admin = await createTestUser({
      role: "admin",
    });

    const token = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const response = await request(app)
      .post(`/api/services/${service._id}/journey`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: 1,
        title: {
          en: "Apply at Office",
          ne: "कार्यालयमा आवेदन दिनुहोस्",
        },
        instructions: {
          en: "Submit the required documents.",
          ne: "आवश्यक कागजातहरू बुझाउनुहोस्।",
        },
        responsibleOffice: null,
        estimatedTime: {
          en: "1 day",
          ne: "१ दिन",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.serviceId).toBe(service._id.toString());
  });
});