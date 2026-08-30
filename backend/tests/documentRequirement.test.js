import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import {
  createTestUser,
  createTestService,
} from "./helpers/testData.js";

import { loginTestUser } from "./helpers/auth.js";

describe("Document Requirement API", () => {
  it("should allow public users to get document requirements", async () => {
    const service = await createTestService();

    const response = await request(app)
      .get(`/api/services/${service._id}/documents`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should not allow a citizen to create a document requirement", async () => {
    const service = await createTestService();

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post(`/api/services/${service._id}/documents`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        label: {
          en: "Citizenship Certificate",
          ne: "नागरिकता प्रमाणपत्र",
        },
        mandatory: true,
        notes: {
          en: "Bring the original document.",
          ne: "सक्कल कागजात ल्याउनुहोस्।",
        },
        order: 1,
      });

    expect(response.status).toBe(403);
  });

  it("should not allow a citizen to update a document requirement", async () => {
    const service = await createTestService();

    const admin = await createTestUser({
      role: "admin",
    });

    const adminToken = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const createResponse = await request(app)
      .post(`/api/services/${service._id}/documents`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        label: {
          en: "Citizenship Certificate",
          ne: "नागरिकता प्रमाणपत्र",
        },
        mandatory: true,
        order: 1,
      });

    expect(createResponse.status).toBe(201);

    const documentId = createResponse.body.data._id;

    const citizen = await createTestUser();

    const citizenToken = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .patch(`/api/documents/${documentId}`)
      .set("Authorization", `Bearer ${citizenToken}`)
      .send({
        mandatory: false,
      });

    expect(response.status).toBe(403);
  });

  it("should not allow a citizen to delete a document requirement", async () => {
    const service = await createTestService();

    const admin = await createTestUser({
      role: "admin",
    });

    const adminToken = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const createResponse = await request(app)
      .post(`/api/services/${service._id}/documents`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        label: {
          en: "Citizenship Certificate",
          ne: "नागरिकता प्रमाणपत्र",
        },
        mandatory: true,
        order: 1,
      });

    expect(createResponse.status).toBe(201);

    const documentId = createResponse.body.data._id;

    const citizen = await createTestUser();

    const citizenToken = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .delete(`/api/documents/${documentId}`)
      .set("Authorization", `Bearer ${citizenToken}`);

    expect(response.status).toBe(403);
  });
});